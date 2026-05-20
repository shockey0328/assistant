/**
 * 橙子学 — 用户反馈分析助手
 * 前端交互逻辑
 */

// ========== API 配置 ==========
const API_BASE = '/api';

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFileUpload();
    initLogUpload();
    initClassify();
    initPathAnalysis();
    initReport();
    initRevise();
    loadRules();
    initFeedbackCounter();
    initCopyDownloadButtons();
});

// ========== 导航切换 ==========
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('tab-' + item.dataset.tab).classList.add('active');
            if (item.dataset.tab === 'revise') loadRules();
        });
    });
}

// ========== 文件上传（反馈数据） ==========
function initFileUpload() {
    const area = document.getElementById('uploadArea');
    const input = document.getElementById('fileInput');

    area.addEventListener('click', (e) => {
        if (e.target.tagName === 'LABEL') return;
        input.click();
    });
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('dragover'); });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', (e) => {
        e.preventDefault(); area.classList.remove('dragover');
        if (e.dataTransfer.files[0]) handleFeedbackFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', () => {
        if (input.files[0]) handleFeedbackFile(input.files[0]);
    });
}

function handleFeedbackFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('feedbackInput').value = e.target.result;
        updateFeedbackCount();
        showToast('已加载: ' + file.name, 'success');
    };
    reader.readAsText(file, 'UTF-8');
}

// ========== 文件上传（行为日志） ==========
function initLogUpload() {
    const input = document.getElementById('logFileInput');
    const btn = document.getElementById('logUploadBtn');
    if (btn) btn.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            document.getElementById('logFileName').textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('pathLogInput').value = e.target.result;
                showToast('已加载日志: ' + file.name, 'success');
            };
            reader.readAsText(file, 'UTF-8');
        }
    });
}

// ========== 反馈行数统计 ==========
function initFeedbackCounter() {
    document.getElementById('feedbackInput').addEventListener('input', updateFeedbackCount);
}

function updateFeedbackCount() {
    const text = document.getElementById('feedbackInput').value.trim();
    const count = text ? text.split('\n').filter(l => l.trim()).length : 0;
    document.getElementById('feedbackCount').textContent = count + ' 条反馈';
}

// ========== 反馈分类 ==========
function initClassify() {
    document.getElementById('classifyBtn').addEventListener('click', async () => {
        const input = document.getElementById('feedbackInput').value.trim();
        if (!input) return showToast('请输入反馈数据', 'error');

        showLoading('AI 正在分析反馈，穿透表面看本质...');
        try {
            const res = await apiCall('/api/classify', { feedback_data: input });
            showResult('classifyResult', 'classifyResultContent', res.result);
            document.getElementById('reportClassified').value = res.result;
            showToast('分类分析完成', 'success');
        } catch (e) {
            showToast('分析失败: ' + e.message, 'error');
        } finally {
            hideLoading();
        }
    });

    document.getElementById('copyResultBtn')?.addEventListener('click', () => copyResult('classifyResultContent'));
    document.getElementById('downloadResultBtn')?.addEventListener('click', () => downloadResult('classifyResultContent', 'classification'));
}

// ========== 路径分析 ==========
function initPathAnalysis() {
    document.getElementById('pathBtn').addEventListener('click', async () => {
        const uid = document.getElementById('pathUid').value.trim();
        const time = document.getElementById('pathTime').value.trim();
        const feedback = document.getElementById('pathFeedback').value.trim();
        const logData = document.getElementById('pathLogInput').value.trim();

        if (!uid || !time || !logData) return showToast('请填写用户ID、反馈时间和行为日志', 'error');

        showLoading('AI 正在分析用户行为路径...');
        try {
            const res = await apiCall('/api/path_analysis', {
                user_id: uid, feedback_time: time,
                feedback_text: feedback, behavior_log: logData
            });
            showResult('pathResult', 'pathResultContent', res.result);
            const pathsEl = document.getElementById('reportPaths');
            const prev = pathsEl.value.trim();
            pathsEl.value = prev ? prev + '\n\n---\n\n' + res.result : res.result;
            showToast('路径分析完成', 'success');
        } catch (e) {
            showToast('分析失败: ' + e.message, 'error');
        } finally {
            hideLoading();
        }
    });
}

// ========== 汇总报告 ==========
function initReport() {
    document.getElementById('reportBtn').addEventListener('click', async () => {
        const classified = document.getElementById('reportClassified').value.trim();
        if (!classified) return showToast('请粘贴已分类的反馈数据', 'error');
        const paths = document.getElementById('reportPaths').value.trim() || '暂无';

        showLoading('AI 正在生成汇总报告...');
        try {
            const res = await apiCall('/api/report', {
                classified_data: classified, path_results: paths
            });
            showResult('reportResult', 'reportResultContent', res.result);
            showToast('周报生成完成', 'success');
        } catch (e) {
            showToast('生成失败: ' + e.message, 'error');
        } finally {
            hideLoading();
        }
    });
}

// ========== 修订管理 ==========
function initRevise() {
    document.getElementById('reviseBtn').addEventListener('click', async () => {
        const data = {
            feedback_id: document.getElementById('reviseId').value.trim(),
            original_text: document.getElementById('reviseText').value.trim(),
            original_category: document.getElementById('reviseOriginal').value,
            revised_category: document.getElementById('reviseRevised').value,
            reason: document.getElementById('reviseReason').value.trim(),
            learned_rule: document.getElementById('reviseRule').value.trim()
        };
        if (!data.feedback_id || !data.reason) return showToast('请填写反馈序号和修订原因', 'error');

        try {
            await apiCall('/api/revise', data);
            showToast('修订已记录，AI 已学习', 'success');
            ['reviseId','reviseText','reviseReason','reviseRule'].forEach(id => {
                document.getElementById(id).value = '';
            });
            loadRules();
        } catch (e) {
            showToast('提交失败: ' + e.message, 'error');
        }
    });
}

// ========== 路径/报告 复制下载按钮 ==========
function initCopyDownloadButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', () => copyResult(btn.getAttribute('data-copy')));
    });
    document.querySelectorAll('[data-download]').forEach(btn => {
        btn.addEventListener('click', () => downloadResult(
            btn.getAttribute('data-download'),
            btn.getAttribute('data-prefix')
        ));
    });
}

// ========== 加载规则和修订历史 ==========
async function loadRules() {
    try {
        const data = await apiCall('/api/rules', {}, 'GET');

        document.getElementById('rulesCount').textContent = data.rules.length;

        const rulesList = document.getElementById('rulesList');
        if (data.rules.length === 0) {
            rulesList.innerHTML = '<p class="empty-state">暂无规则，提交修订后 AI 会自动学习</p>';
        } else {
            rulesList.innerHTML = data.rules.map((r, i) =>
                `<div class="rule-item">
                    <span class="rule-number">${i + 1}</span>
                    <span class="rule-text">${escapeHtml(r.rule)}</span>
                </div>`
            ).join('');
        }

        const revList = document.getElementById('revisionList');
        if (data.revisions.length === 0) {
            revList.innerHTML = '<p class="empty-state">暂无修订记录</p>';
        } else {
            revList.innerHTML = data.revisions.slice(-20).reverse().map(rev =>
                `<div class="revision-item">
                    <div class="revision-item-header">
                        <strong>#${escapeHtml(rev.feedback_id)}</strong>
                        <span class="revision-badge from">${escapeHtml(rev.original_category)}</span>
                        <span class="revision-arrow">→</span>
                        <span class="revision-badge to">${escapeHtml(rev.revised_category)}</span>
                    </div>
                    <div>${escapeHtml(rev.reason)}</div>
                    ${rev.learned_rule ? `<div style="margin-top:4px;color:var(--blue-700);font-size:12px;">🧠 ${escapeHtml(rev.learned_rule)}</div>` : ''}
                    <div class="revision-meta">${rev.timestamp || ''}</div>
                </div>`
            ).join('');
        }
    } catch (e) {
        console.log('规则加载失败（API可能未启动）:', e.message);
    }
}

// ========== API 调用 ==========
async function apiCall(url, data = {}, method = 'POST') {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (method === 'POST') {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(json.detail || json.error || '请求失败');
    }

    if (json.success === false) {
        throw new Error(json.error || json.detail || '请求失败');
    }

    return json;
}

// ========== 结果展示 ==========
function showResult(sectionId, contentId, markdown) {
    document.getElementById(contentId).innerHTML = renderMarkdown(markdown);
    const section = document.getElementById(sectionId);
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

// ========== Markdown 简易渲染 ==========
function renderMarkdown(text) {
    if (!text) return '';

    let html = escapeHtml(text);

    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (match, header, sep, body) => {
        const headers = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
        const rows = body.trim().split('\n').map(row => {
            const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    });

    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    html = html.replace(/^---$/gm, '<hr>');

    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    html = html.replace(/<p><(h[1-4]|ul|ol|table|pre|blockquote|hr)/g, '<$1');
    html = html.replace(/<\/(h[1-4]|ul|ol|table|pre|blockquote)><\/p>/g, '</$1>');
    html = html.replace(/<p><\/p>/g, '');

    return html;
}

// ========== 复制结果 ==========
function copyResult(contentId) {
    const el = document.getElementById(contentId);
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板', 'success');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('已复制到剪贴板', 'success');
    });
}

// ========== 下载结果 ==========
function downloadResult(contentId, prefix) {
    const el = document.getElementById(contentId);
    const text = el.innerText || el.textContent;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `${prefix}_${ts}.md`;

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('已下载: ' + filename, 'success');
}

// ========== Loading ==========
function showLoading(text) {
    document.getElementById('loadingText').textContent = text || 'AI 正在分析中...';
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// ========== Toast 通知 ==========
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== HTML 转义 ==========
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
