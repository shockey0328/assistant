/**
 * 橙子学 — 反馈分析助手（纯前端版）
 * 直接调用 OpenAI/DeepSeek/智谱 等兼容 API，所有数据保存在浏览器 localStorage
 */

// ==================== 橙子学 System Prompt ====================
// 这是整个工具的核心，包含完整的产品知识和分类逻辑

const SYSTEM_PROMPTS = {

classify: `你是橙子学（学科网学生版）的内容运营分析助手。你的核心能力是穿透用户反馈的表面，看到用户的本质需求。

## 橙子学产品知识

### 产品定位
橙子学是K12在线教育平台（学科网学生版），覆盖小初高全学科。核心价值：AI学伴+名校真题/卷库+全场景学习方案+测评学练闭环。

### 用户需求→模块对照
| 需求 | 模块 |
|---|---|
| 搜资源/试卷/学校 | 搜索 |
| 不会的题要讲解 | 拍照答疑 |
| 整理错题反复练 | 错题本 |
| 刷名校真题 | 刷真题 |
| 跟教材同步学习 | 同步学/同步课 |
| 每周巩固 | 周周练 |
| 单元检测 | 同步学（单元测试）|
| 考前冲刺 | 备期中/备期末/备考课 |
| 中考系统复习 | 中考·一轮/二轮/三轮 |
| 高考系统复习 | 高考·一轮/二轮/三轮 |
| 假期预习复习 | 暑假/寒假 |
| 学业水平考试 | 备学考 |

### 功能模块
**【搜索】** 搜试卷/资源/学校。
**【拍照答疑】** 拍单题/整页/跨页，分步讲题，一键加入错题本。
**【错题本】** 在线练习和拍照答疑题目均可添加，按学科/年级/时间/掌握状态筛选，可下载打印再练。
**【刷真题】** 全国名校真题实时更新，按学科/年级/地区/年份筛选，提供阶段检测/期中/期末/升学模考真题/名校专区。标注"精准学"的试卷支持在线练→交卷→试卷报告→AI答疑→举一反三。按百强校/省重点/市重点筛选。
**【同步学】** 小初高各学科教材同步，按学科/版本/章节筛选。诊薄弱·精准练（分层题组/在线练/检测报告/AI答疑/视频讲题），夯基础·学知识（知识讲练），单元测试（测试卷/知识清单/专项练习）。
**【同步课】** 主学科同步配套视频课程。
**【周周练】** 小学语数英周测。
**【知识清单】** 按学科/年级/版本提供知识清单。
**【备期中/备期末】** 轻松学（知识清单）+精准练（专项分层题组）+试卷（期中/期末真题模拟卷，精准学可在线练→报告→举一反三）。
**【备考课】** 小升初/中考/高考备考视频课。
**【中考·一轮/二轮/三轮】** 诊薄弱+学典例+精准练+试卷。
**【高考·一轮/二轮/三轮】** 学典例+精准练+试卷。
**【备学考】** 高中各科学考讲义+仿真卷。
**【暑假/寒假】** 新知预习+开学测试。

### 贯穿功能
在线练（自动批改+学情报告）、AI答疑（分步讲解+举一反三）、下载打印（PDF+扫码解析）、错题本（一键添加+多维筛选+重练）、精准学标签（在线练+完整学情报告）。

## 分类体系
一级分类：**内容问题**
二级分类：
### 1. 查找资源
定义：用户本质需求是"找到某个可用的资源"。判定关键：终极目的是"找到一个能用的东西"。
典型：直接找"有没有XX试卷"，间接找"卷子答案不全"→想要完整卷子，版本找"教材太旧"→想要新版，迷路找"找不到XX"→导航/搜索问题。
特别注意：用户说"答案不全/解析不完整/版本不对"时，表面像内容错误，本质往往是查找资源。

### 2. 内容错误
定义：资源已存在且用户正在使用，但有明确可定位的错误。判定关键：能指出"具体哪里错了"。
典型："第12题答案选B不是C""解析第三步推导有问题""视频8分钟那里讲错了"。

### 3. 内容缺失
定义：橙子学确实不存在某类资源。判定关键：不是"找不到"而是"确实没有"。
典型："没有北师大版""能不能加XX章节""没有XX学校的卷子"。

## 决策逻辑
1. 终极目的是"找到能用的东西"？→ 查找资源
2. 能指出"具体哪里错"？→ 内容错误
3. "橙子学没有某类内容"？→ 内容缺失
4. 不确定？→ ⚠️待确认

## 需查用户路径标准
✅需查：无法定位资料ID、用户说"找不到"需分析原因、反馈模糊、场景不清晰
❌不需查：反馈清晰能直接定位、用户明确说出资源名/科目/章节

## 已学规则
{learned_rules}
{product_knowledge_extra}

## 输出格式
对每条反馈输出：
### 反馈 #序号
- **用户ID**：xxx
- **反馈时间**：xxx
- **原文**：xxx
- **表面指向**：一句话
- **本质需求**：一句话
- **二级分类**：查找资源/内容错误/内容缺失/⚠️待确认
- **关联模块**：橙子学模块名
- **资源类型**：试卷/题组/解析/视频课/知识清单/...
- **置信度**：高/中/低
- **是否需查用户路径**：✅是/❌否
  - 原因：xxx
- **行动建议**：xxx

分析完后生成汇总：数据概览→查找资源需求聚类→内容错误归类→内容缺失盘点→重点行动项→需查路径清单→给产品团队的反馈。

## 修订机制
当我修订时：接受→理解→提炼规则→输出修订记录。`,

classifySingle: `你是橙子学（学科网学生版·K12在线教育平台）的内容运营分析助手。

你的核心任务是：
1. **识别用户需求**：用户到底想要什么？
2. **判断满足状态**：橙子学是否已满足该需求？满足了为什么用户没找到？没满足则作为需求提出。
3. **评估建设优先级**：根据需求强烈程度、影响范围等，给出内容建设优先级和建议。

---

# 橙子学产品知识

## 产品定位
橙子学是面向小初高学生和家长的在线教育平台（学科网学生版）。
核心能力：AI学伴 + 名校真题/卷库 + 全场景学习方案 + 测评学练闭环。

## 功能模块全景

| 学习场景 | 模块名称 | 核心能力 | 资源类型 |
|----------|----------|----------|----------|
| 搜与问 | **搜索** | 搜试卷、搜资源、搜学校 | 试卷、学习资源 |
| 搜与问 | **拍照答疑** | 拍单题/整页/跨页→AI分步讲题→加错题本 | AI解答 |
| 搜与问 | **错题本** | 在线练+拍照题目收录，按学科/年级/时间/掌握状态筛选，下载打印再练 | 错题集 |
| 刷真题 | **刷真题** | 全国名校真题每日更新；按学科/年级/地区/年份/学校层级筛选；精准学→在线练→报告→AI答疑→举一反三；名校专区 | 真题试卷、模考卷、检测卷 |
| 学教材 | **同步学** | 按学科/版本/章节筛选；诊薄弱·精准练（分层题组→在线练→报告→AI答疑→视频讲题）；夯基础·学知识（知识讲练）；单元测试（测试卷+知识清单+专项练习） | 同步题组、知识讲练、单元卷、知识清单 |
| 学教材 | **同步课** | 主学科+主流版本同步视频课 | 视频课 |
| 学教材 | **周周练** | 小学语数英周测 | 周测卷 |
| 学教材 | **知识清单** | 按学科/年级/版本提供 | 知识清单 |
| 备考冲刺 | **备期中/备期末** | 轻松学（知识清单）+精准练（专项分层题组）+试卷（期中/期末真题模拟卷，精准学可在线练） | 知识清单、题组、期中期末卷 |
| 备考冲刺 | **备考课** | 小升初/中考/高考备考视频课 | 视频课 |
| 备考冲刺 | **中考·一轮/二轮/三轮** | 诊薄弱+学典例+精准练+试卷 | 诊断题组、典例讲解、复习讲义、模拟卷 |
| 备考冲刺 | **高考·一轮/二轮/三轮** | 学典例+精准练+试卷 | 同上 |
| 备考冲刺 | **备学考** | 高中各科学考讲义+仿真卷 | 讲义、仿真卷 |
| 假期提升 | **暑假/寒假** | 预习+开学测试 | 预习资料、测试卷 |

## 贯穿功能
- **在线练**：部分试卷/题组→在线作答→自动批改→学情报告
- **AI答疑**：在线练习题→AI分步讲解→举一反三
- **下载打印**：PDF下载→纸质作答→扫码查解析
- **错题本**：贯穿所有在线练习→一键添加→多维筛选→重练
- **精准学标签**：标注的试卷支持完整在线练+学情报告流程

---

# 分析框架

## 核心分析逻辑

对每条反馈，按以下框架分析：

### 第一步：识别用户需求
用户到底想要什么？穿透表面措辞，找到本质需求。
例："卷子解析答案不全" → 本质需求：一份完整的、解析齐全的试卷

### 第二步：判断满足状态
橙子学**是否已有**能满足该需求的内容？

**状态A：已满足，但用户没找到**
- 平台有该资源，但用户通过搜索/导航没找到
- 结论方向：这是产品侧问题（搜索/导航/入口），不是内容问题
- 行动：建议查看用户路径，了解用户是怎么找的，汇总后反馈产品优化

**状态B：未满足，平台确实没有**
- 平台确实缺少该类内容
- 结论方向：这是**内容需求**，需要提出并评估建设优先级
- 行动：明确缺什么、属于哪个模块、建议怎么建设

**状态C：不确定**
- 仅凭反馈无法判断平台是否已有该资源
- 行动：需要进一步核实或查看用户路径

### 第三步：评估优先级（针对状态B的内容需求）
基于以下维度评估建设优先级：

| 维度 | P0（紧急/重要） | P1（重要） | P2（一般） |
|------|-----------------|------------|------------|
| 需求强烈程度 | 用户语气强烈/多次反馈 | 明确表达需求 | 随口一提 |
| 影响范围 | 涉及主流版本/主要学科 | 涉及次要版本/科目 | 极小众需求 |
| 学习场景重要性 | 备考/考试刚需 | 日常学习需要 | 锦上添花 |
| 竞品对比 | 用户提到"别的平台有" | — | — |
| 时效性 | 当前学期/考试急需 | 下学期需要 | 无时效要求 |

---

# 分类体系

## 二级分类

### 1. 查找资源 🔎
用户的本质需求是"找到某个可用的资源"。
包含两种情况：
- **平台可能已有**：用户没找到（搜索/导航问题）
- **不确定是否有**：需进一步核实

### 2. 内容需求 📋
平台**确实没有**用户需要的内容，应作为内容建设需求提出。
（对应原来的"内容缺失"，改名更贴合实际工作）

### 3. 内容错误 ❌
用户指出了具体的、可定位的错误。
**处理说明**：大部分内容错误由运营侧直接处理（运营会勾选确定资料ID），分析时记录即可，不需要重点展开。

### 4. 无效反馈 ⚪
信息太少，无法判断用户的实际需求。
例："不好用""差评""垃圾"等无具体信息的反馈。

---

# 是否需查用户路径

| 情况 | 是否需查 | 说明 |
|------|----------|------|
| 模块明确 + 需求明确 | ❌ 不需查 | 直接记录。例："同步学里没有知识清单"→直接反馈 |
| 需求明确但模块不明确 | ✅ 需查 | 定位是在哪个模块。例："没有期末复习资料"→是备期末？同步学？刷真题？ |
| 有一些信息但不完善 | ✅ 需查 | 补充上下文。例："这个答案不全"→哪个资源？ |
| 信息太少无法判断 | ❌ 不需查 | 标记为无效反馈 |
| 内容错误类 | ❌ 一般不需查 | 运营侧会勾选确定资料ID。除非运营标记需要协助定位 |
| 用户说"找不到/搜不到" | ✅ 需查 | 分析用户搜索路径，判断是产品问题还是内容问题 |

---

# 已学习的修订规则

{learned_rules}

---

# 输出格式（单条分析）

仅分析用户给出的一条反馈。用 Markdown，**下列字段必须各占一行**（便于系统解析为表格标签）：

- **二级分类**：（查找资源 / 内容需求 / 内容错误 / 无效反馈，只填一类）
- **关联模块**：（橙子学模块名，如：搜索 / 刷真题 / 同步学；无法判断填「待定位」）
- **用户需求**：（一句话，用户想要什么）
- **满足状态**：（✅已满足但没找到 / ❌未满足（内容需求）/ ❓不确定 / ⚪无效反馈）
- **判断依据**：（一句话，为什么这样判断）
- **资源类型**：（试卷/题组/解析/视频课/知识清单/讲义/…，无则填 —）
- **建设优先级**：（仅当二级分类为「内容需求」时填写 P0/P1/P2 + 一句理由；否则填 —）
- **是否需查路径**：（✅需查（原因）/ ❌不需查）
- **建议**：（1-3 条具体行动：查路径/内容建设/运营处理/标记跳过等）

{product_knowledge_extra}
`,

path: `你是橙子学（学科网学生版）的用户行为分析助手。
{product_knowledge_extra}

## 橙子学用户典型路径
搜索：首页→搜索框→关键词→结果→资源详情→预览/下载/在线练
刷真题：底部导航→刷真题→筛选→试卷列表→详情→预览/下载/在线练(精准学)→交卷→报告→AI答疑/举一反三/错题本
同步学：底部导航→同步学→学科→版本→章节→精准练/学知识/单元测试
同步课：底部导航→同步课→学科/版本→课程→播放
备考：备考专区→选模块→轻松学/学典例/精准练/试卷
拍照答疑：首页→拍照→AI解答→分步讲题→加入错题本
错题本：个人中心→错题本→筛选→查看→重练/打印

## 行为模式关注
反复搜索→搜索匹配问题、快速退出(<5秒)→不符预期、长时间停留后反馈→真实问题、多资源切换→找不到、跨模块跳转→导航不清、视频播放后反馈→该时间点有问题

## 输出
### 🎯 路径定位
行为轨迹表 + 资料ID/名称/模块/使用功能/用户路径/问题定位/关键发现
### 📖 用户故事
200-300字，用橙子学真实模块名，贴合K12场景
### 💡 用户洞察 + 建议（内容侧+产品侧）`,

report: `你是橙子学（学科网学生版）的内容运营分析助手。根据已分类反馈和路径分析生成汇总报告。
{product_knowledge_extra}
要求：本质需求聚合分析、关联橙子学模块、"找不到"类单独归纳附路径案例、区分内容侧和产品侧建议。
输出：数据概览→查找资源需求聚类→内容错误归类→内容需求盘点（含优先级）→重点行动项→产品侧反馈→典型用户故事。`,

knowledgeUpdate: `你是橙子学（学科网学生版）产品知识库维护助手。运营人员会同步产品功能的新增、调整、下线说明，请你整理为可被反馈分类与路径分析引用的「动态补充知识」。

## 已有动态补充（请合并更新，删除已下线项，避免重复）
{current_extra}

## 本期产品变更说明（运营输入）
{sync_notes}

## 输出要求
1. 使用 Markdown，包含：**模块变更一览**（标注新增/调整/下线）、**功能要点**、**分析提示**（分类或判模块时注意什么）
2. 模块命名与橙子学一致：搜索、拍照答疑、错题本、刷真题、同步学、同步课、周周练、知识清单、备期中/期末、备考课、中考/高考轮次、暑假/寒假、备学考、AI答疑、在线练等
3. 只输出补充正文，不要寒暄；控制在 800 字以内，条理清晰`
};

// ==================== 第10周真实样例 ====================
const WEEK_DATA = {
    indexUrl: 'data/test/behavior_logs/index.json',
    feedbackUrl: 'data/input/week_2026_w10_feedback_ai.txt',
    /** 测试用：一周在线问题反馈（26年第10周） */
    testFeedbackXlsx: 'data/test/week_2026_w10_online_feedback.xlsx'
};
const LS_CLASSIFY_PREFIX = 'cz_classify_';
const CLASSIFY_CONFIRM_HINT = '确认后将同步「需查路径」与分析结论至「路径分析」与「汇总报告」';
const LS_PATH_PREFIX = 'cz_path_';
const LS_REPORT_PREFIX = 'cz_report_';
/** 路径分析：取反馈时间点之前 N 分钟内的行为日志（与后端 data_loader 一致） */
const PATH_LOG_WINDOW_MINUTES = 30;
const LS_CURRENT_PERIOD = 'cz_current_period_id';
let feedbackPeriods = [];
let currentPeriodId = 'week_2026_w10';
let weekIndex = null;
/** 完整行为日志（供 AI 分析，textarea 可能仅预览） */
let pathLogStore = '';
/** 用户上传的全量行为日志 CSV 原文，用于按 user_id 筛选 */
let masterLogCsvText = null;
let pathUidLoadTimer = null;
/** 当前展示的路径分析草稿（点击保存后才写入 localStorage 并同步汇总报告） */
let pendingPathDraft = null;
/** file:// 下由用户选择的本地行为日志：user_id → CSV 全文 */
const behaviorLogCsvCache = new Map();
let behaviorDirPickResolve = null;
let batchItems = [];
/** 最近一次从 CSV/xlsx 解析的原始行，用于「解析并预览」时保留会员与用户ID */
let feedbackRowsCache = null;
let batchAbort = false;
let batchRunning = false;
const MEMBERSHIP_MAP = {
    '49': '月卡', '99': '季卡', '188': '半年卡',
    '219': '月卡升年卡', '268': '年卡', '598': '三年卡'
};

async function loadMembershipMap() {
    try {
        const res = await fetch('config/membership_map.json');
        if (res.ok) {
            const data = await res.json();
            Object.keys(data).forEach(k => {
                if (!k.startsWith('_')) MEMBERSHIP_MAP[k] = data[k];
            });
        }
    } catch (_) { /* optional */ }
}

function formatMembership(raw) {
    if (raw == null || raw === '' || String(raw).trim() === '' || String(raw) === 'nan') return '免费用户';
    const code = String(raw).replace(/\.0$/, '').trim();
    return MEMBERSHIP_MAP[code] || `未知(${code})`;
}

function membershipTypeCellHtml(item) {
    const label = formatMembership(item.membership);
    return `<span class="analysis-tag analysis-tag-member">${esc(label)}</span>`;
}

function userIdCellHtml(item) {
    const uid = item.userId && item.userId !== '—' ? String(item.userId).trim() : '';
    if (!uid) return '<span class="analysis-tag empty">—</span>';
    return `<span class="cell-uid">${esc(uid)}</span>`;
}

function isSpreadsheetGarbage(text) {
    const s = (text || '').trimStart();
    return s.startsWith('PK') || s.includes('docProps/') || s.includes('[Content_Types]');
}

function requireHttpServer() {
    if (location.protocol === 'file:') {
        throw new Error('请双击项目中的「启动工具.bat」或运行 python -m http.server 8080 后访问 http://localhost:8080/index.html');
    }
}

function isFileProtocol() {
    return location.protocol === 'file:';
}

function getBehaviorLogDirInput() {
    let input = document.getElementById('behaviorLogDirInput');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'behaviorLogDirInput';
        input.setAttribute('webkitdirectory', '');
        input.multiple = true;
        input.hidden = true;
        document.body.appendChild(input);
        input.addEventListener('change', async () => {
            const files = input.files;
            let ok = false;
            if (files?.length) {
                ok = await ingestBehaviorLogDirectory(files);
            }
            input.value = '';
            if (behaviorDirPickResolve) {
                behaviorDirPickResolve(ok);
                behaviorDirPickResolve = null;
            }
        });
    }
    return input;
}

async function ingestBehaviorLogDirectory(fileList) {
    behaviorLogCsvCache.clear();
    let indexJson = null;
    for (const file of fileList) {
        const rel = (file.webkitRelativePath || file.name).replace(/\\/g, '/');
        const base = rel.split('/').pop() || rel;
        const lower = base.toLowerCase();
        if (lower.endsWith('_index.json') && lower.includes('week_')) {
            try {
                indexJson = JSON.parse(await file.text());
            } catch (_) { /* ignore */ }
            continue;
        }
        if (!lower.endsWith('.csv')) continue;
        const uid = base.replace(/\.csv$/i, '').trim();
        if (!uid || uid.includes('.')) continue;
        behaviorLogCsvCache.set(uid, await file.text());
    }
    if (indexJson?.users?.length) {
        weekIndex = indexJson;
    } else if (behaviorLogCsvCache.size > 0) {
        weekIndex = {
            id: currentPeriodId || 'week_2026_w10',
            users: [...behaviorLogCsvCache.keys()].map(uid => ({
                user_id: uid,
                log_file: '',
                log_rows: Math.max(0, (behaviorLogCsvCache.get(uid) || '').split(/\r?\n/).filter(l => l.trim()).length - 1)
            }))
        };
    }
    return behaviorLogCsvCache.size > 0;
}

function getUserLogFromLocalCache(uid) {
    const id = String(uid || '').trim();
    if (!id) return '';
    if (behaviorLogCsvCache.has(id)) return behaviorLogCsvCache.get(id);
    const safe = id.replace(/[^\w\-]/g, '_');
    return behaviorLogCsvCache.get(safe) || '';
}

function pickBehaviorLogDirectory() {
    return new Promise(resolve => {
        if (!isFileProtocol()) {
            resolve(false);
            return;
        }
        behaviorDirPickResolve = resolve;
        toast('请选择 data/behavior_logs 文件夹（或其中的 week_*_users 子文件夹）', 'info');
        getBehaviorLogDirInput().click();
    });
}

async function ensureLocalBehaviorLogs({ promptIfEmpty = true } = {}) {
    if (!isFileProtocol()) return false;
    if (behaviorLogCsvCache.size > 0) return true;
    if (!promptIfEmpty) return false;
    return pickBehaviorLogDirectory();
}

function applyLoadedPathLog(uid, csvText, feedbackTime, silent) {
    const applied = applyBehaviorLogForPath(csvText, feedbackTime);
    if (!silent) {
        const win = applied.windowMinutes || PATH_LOG_WINDOW_MINUTES;
        if (applied.usedFallback) {
            toast(`反馈前 ${win} 分钟内无记录，已加载全部 ${applied.rowCount} 条日志供分析`, 'ok');
        } else if (applied.filtered && applied.rows > 0) {
            toast(`已加载用户 ${uid}：反馈前 ${win} 分钟内 ${applied.rows} 条日志`, 'ok');
        } else {
            toast(`已加载用户 ${uid} 的 ${applied.rowCount} 条行为记录`, 'ok');
        }
    }
    return true;
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadMembershipMap();
    initNav();
    initSettings();
    initWeekData();
    initClassify();
    initPath();
    initReport();
    initKnowledge();
    renderRules();
});

async function loadFeedbackPeriodsConfig() {
    try {
        if (location.protocol === 'file:') return;
        const res = await fetch('config/feedback_periods.json?_=' + Date.now());
        if (!res.ok) return;
        const data = await res.json();
        if (data.periods?.length) feedbackPeriods = data.periods;
    } catch (_) { /* ignore */ }
    if (!feedbackPeriods.length) {
        feedbackPeriods = [{
            id: 'week_2026_w10',
            label: '26年第10周',
            indexUrl: WEEK_DATA.indexUrl,
            feedbackXlsx: WEEK_DATA.testFeedbackXlsx,
            feedbackCsv: 'data/input/week_2026_w10_feedback.csv',
            defaultFeedbackTime: '2026-03-11 12:00:00'
        }];
    }
}

function getCurrentPeriodId() {
    return currentPeriodId || localStorage.getItem(LS_CURRENT_PERIOD) || feedbackPeriods[0]?.id || 'week_2026_w10';
}

function getPeriodById(periodId) {
    return feedbackPeriods.find(p => p.id === periodId) || null;
}

function getClassifySnapshot(periodId) {
    try {
        return JSON.parse(localStorage.getItem(LS_CLASSIFY_PREFIX + periodId) || 'null');
    } catch {
        return null;
    }
}

function isPeriodClassifyConfirmed(periodId) {
    const snap = getClassifySnapshot(periodId);
    if (!snap?.confirmed) return false;
    return getPublishedClassifyItems(periodId).some(
        i => i.status === 'done' && (i.resultBody || i.categoryL2)
    );
}

function mergeClassifySnapshotWithLive(snapshotItems) {
    if (!batchItems.length) return snapshotItems || [];
    if (!snapshotItems?.length) {
        return batchItems.map(it => ({
            ...it,
            time: normalizeFeedbackTime(it.time) || it.time
        }));
    }
    return snapshotItems.map(si => {
        const live = batchItems.find(b => b.seq === si.seq
            || (b.userId === si.userId && b.message === si.message));
        if (!live) return si;
        return {
            ...si,
            time: live.time || si.time,
            message: live.message || si.message,
            membership: live.membership ?? si.membership,
            labelL1: live.labelL1 || si.labelL1,
            labelL2: live.labelL2 || si.labelL2,
            categoryL2: live.categoryL2 || si.categoryL2,
            relatedModule: live.relatedModule || si.relatedModule,
            needPath: live.needPath ?? si.needPath,
            status: live.status || si.status,
            resultBody: live.resultBody || si.resultBody || stripStructuredFieldsFromResult(live.result) || ''
        };
    });
}

function isExcelSerialString(s) {
    return /^\d{4,6}(\.\d+)?$/.test(String(s || '').trim());
}

function saveClassifySnapshot(periodId, options = {}) {
    const pid = periodId || getCurrentPeriodId();
    if (!pid || !batchItems.length) return;
    const prev = getClassifySnapshot(pid);
    let confirmed = prev?.confirmed === true;
    let confirmedAt = prev?.confirmedAt;

    if (options.confirmed === true) {
        confirmed = true;
        confirmedAt = new Date().toISOString();
    } else if (options.confirmed === false) {
        confirmed = false;
        confirmedAt = undefined;
    } else if (options.keepConfirmed !== true && confirmed) {
        confirmed = false;
        confirmedAt = undefined;
    }

    const snapshot = {
        periodId: pid,
        savedAt: new Date().toISOString(),
        confirmed,
        confirmedAt,
        items: batchItems.map(i => ({
            seq: i.seq,
            userId: i.userId,
            time: normalizeFeedbackTime(i.time) || i.time,
            message: i.message,
            membership: i.membership,
            categoryL2: i.categoryL2,
            relatedModule: i.relatedModule,
            labelL1: i.labelL1,
            labelL2: i.labelL2,
            needPath: i.needPath,
            status: i.status,
            resultBody: i.resultBody || stripStructuredFieldsFromResult(i.result) || ''
        }))
    };
    localStorage.setItem(LS_CLASSIFY_PREFIX + pid, JSON.stringify(snapshot));
    refreshPathPeriodSelect();
    refreshReportPeriodSelect();
    updateConfirmClassifyStatus();
}

function getClassifyItemsForPeriod(periodId) {
    const snap = getClassifySnapshot(periodId);
    let items = snap?.items?.length ? snap.items : [];
    if (periodId === getCurrentPeriodId() && batchItems.length) {
        items = mergeClassifySnapshotWithLive(items);
    }
    return items.map(it => ({
        ...it,
        time: normalizeFeedbackTime(it.time) || it.time
    }));
}

/** 已确认并发布至路径分析 / 汇总报告的分类条目 */
function getPublishedClassifyItems(periodId) {
    const snap = getClassifySnapshot(periodId);
    if (!snap?.confirmed) return [];
    let items = snap.items?.length ? snap.items : [];
    if (periodId === getCurrentPeriodId() && batchItems.length) {
        items = mergeClassifySnapshotWithLive(items);
    }
    return items.map(it => ({
        ...it,
        time: normalizeFeedbackTime(it.time) || it.time
    }));
}

function formatConfirmTime(iso) {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleString('zh-CN', { hour12: false });
    } catch {
        return iso;
    }
}

function updateConfirmClassifyStatus() {
    const statusEl = document.getElementById('classifyConfirmStatus');
    const btn = document.getElementById('confirmClassifyBtn');
    if (!statusEl || !btn) return;
    const pid = getCurrentPeriodId();
    const snap = getClassifySnapshot(pid);
    const doneCount = batchItems.filter(
        i => i.status === 'done' && (i.resultBody || i.categoryL2)
    ).length;
    btn.disabled = doneCount === 0;
    statusEl.classList.toggle('is-confirmed', snap?.confirmed === true);
    if (snap?.confirmed) {
        statusEl.textContent = `已于 ${formatConfirmTime(snap.confirmedAt)} 确认分类，已同步至路径分析与汇总报告（${doneCount} 条）`;
    } else if (doneCount > 0) {
        statusEl.textContent = `共 ${doneCount} 条可确认，点击下方按钮同步至路径分析与汇总报告`;
    } else {
        statusEl.textContent = CLASSIFY_CONFIRM_HINT;
    }
}

function confirmClassify() {
    const pid = getCurrentPeriodId();
    const done = batchItems.filter(
        i => i.status === 'done' && (i.resultBody || i.categoryL2)
    );
    if (!done.length) {
        toast('请先完成至少一条 AI 批量分析', 'err');
        return;
    }
    saveClassifySnapshot(pid, { confirmed: true });
    refreshPathFillUI();
    const reportSel = document.getElementById('reportPeriod');
    if (reportSel && ![...reportSel.options].some(o => o.value === pid)) {
        refreshReportPeriodSelect();
    }
    if (reportSel) reportSel.value = pid;
    loadReportPeriodData(pid);
    toast(`已确认分类（${done.length} 条），已同步至路径分析与汇总报告`, 'ok');
}

function fillClassifiedPeriodSelect(selectId, emptyMsg, pickLabel, periodFilterFn) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const check = periodFilterFn || isPeriodClassifyConfirmed;
    let classified = feedbackPeriods.filter(p => check(p.id));
    const curId = getCurrentPeriodId();
    if (curId && batchItems.length && !classified.some(p => p.id === curId)) {
        const cur = getPeriodById(curId) || { id: curId, label: curId, labelFull: curId };
        if (check(curId)) classified = [cur, ...classified];
    }
    sel.innerHTML = classified.length
        ? `<option value="">${pickLabel}</option>`
        : `<option value="">${emptyMsg}</option>`;
    classified.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.labelFull || p.label || p.id;
        sel.appendChild(opt);
    });
    const cur = getCurrentPeriodId();
    if (classified.some(p => p.id === cur)) sel.value = cur;
}

function refreshPathPeriodSelect() {
    fillClassifiedPeriodSelect('pathPeriod', '暂无可选周期，请先在反馈分类确认分类', '— 选择周期 —');
}

function refreshReportPeriodSelect() {
    fillClassifiedPeriodSelect(
        'reportPeriod',
        '暂无可选周期，请先在反馈分类加载数据',
        '— 选择周期 —',
        isPeriodReportable
    );
}

/** 汇总报告可用的反馈条目（含 AI 结论或导入表内标签） */
function getReportableClassifyItems(periodId) {
    return getPublishedClassifyItems(periodId).filter(i =>
        i.message && String(i.userId).trim() && String(i.userId).trim() !== '—'
    );
}

function isPeriodReportable(periodId) {
    if (!periodId) return false;
    if (getReportableClassifyItems(periodId).length > 0) return true;
    if (getPathStoriesForPeriod(periodId).length > 0) return true;
    const snap = getClassifySnapshot(periodId);
    if (snap?.items?.some(i => i.status === 'done' && (i.resultBody || i.categoryL2))) return true;
    if (periodId === getCurrentPeriodId() && batchItems.some(
        i => i.status === 'done' && (i.resultBody || i.categoryL2)
    )) return true;
    return false;
}

function ensureReportPeriodInSelect(periodId) {
    const sel = document.getElementById('reportPeriod');
    if (!sel || !periodId) return;
    if ([...sel.options].some(o => o.value === periodId)) return;
    const p = getPeriodById(periodId) || { id: periodId, label: periodId, labelFull: periodId };
    const opt = document.createElement('option');
    opt.value = periodId;
    opt.textContent = p.labelFull || p.label || periodId;
    sel.appendChild(opt);
}

function formatReportItemBlock(item, { sourceOnly = false } = {}) {
    const membership = formatMembership(item.membership);
    const lines = [
        `## 用户 ${item.userId}（${membership}）`,
        `- 反馈时间：${displayItemTime(item.time)}`,
        `- 一级分类：${item.labelL1 || '—'}`,
        `- 二级分类：${item.categoryL2 || item.labelL2 || '—'}`,
        `- 关联模块：${item.relatedModule || '—'}`,
        `- 需查路径：${item.needPath === true ? '是' : item.needPath === false ? '否' : '—'}`,
        `- 反馈原文：${item.message || '—'}`,
        ''
    ];
    if (sourceOnly) {
        lines.push('**状态：** 仅导入标注，待 AI 批量分析');
    } else {
        lines.push('**分析结论：**');
        lines.push(item.resultBody || item.result || '（无分析正文）');
    }
    lines.push('');
    return lines.join('\n');
}

function buildClassifiedReportText(periodId) {
    let all = getReportableClassifyItems(periodId);
    if (!all.length) {
        all = getClassifyItemsForPeriod(periodId).filter(i =>
            i.message && String(i.userId).trim() && String(i.userId).trim() !== '—'
        );
    }
    const period = getPeriodById(periodId);
    const title = period?.labelFull || period?.label || periodId;
    if (!all.length) return '';

    const done = all.filter(i => i.status === 'done' && (i.resultBody || i.categoryL2 || i.result));
    const sourceOnly = all.filter(i =>
        !(i.status === 'done' && (i.resultBody || i.categoryL2 || i.result))
    );

    const lines = [`# ${title} · 反馈分类汇总`, ''];

    if (done.length) {
        lines.push(`## AI 分析结论（${done.length} 条）`, '');
        done.forEach(item => lines.push(formatReportItemBlock(item)));
    }

    if (sourceOnly.length) {
        lines.push(`## 导入数据 / 待分析（${sourceOnly.length} 条）`, '');
        if (!done.length) {
            lines.push('> 以下条目来自测试文件或表格导入。生成正式周报前建议先完成「批量分析」。', '');
        }
        sourceOnly.forEach(item => lines.push(formatReportItemBlock(item, { sourceOnly: true })));
    }

    return lines.join('\n').trim();
}

function saveReportResult(periodId, markdown) {
    const pid = periodId || getCurrentPeriodId();
    if (!pid || !markdown?.trim()) return;
    localStorage.setItem(LS_REPORT_PREFIX + pid, JSON.stringify({
        savedAt: new Date().toISOString(),
        markdown: markdown.trim()
    }));
}

function restoreSavedReport(periodId) {
    const pid = periodId || getCurrentPeriodId();
    if (!pid) return;
    try {
        const raw = JSON.parse(localStorage.getItem(LS_REPORT_PREFIX + pid) || 'null');
        if (raw?.markdown) {
            showResultPanel('reportResult', 'reportBody', raw.markdown);
        }
    } catch { /* ignore */ }
}

function getPathStoriesStore(periodId) {
    try {
        const raw = JSON.parse(localStorage.getItem(LS_PATH_PREFIX + periodId) || '{"stories":[]}');
        if (raw && Array.isArray(raw.stories)) return raw;
        return { stories: [] };
    } catch {
        return { stories: [] };
    }
}

function getPathStoriesForPeriod(periodId) {
    return getPathStoriesStore(periodId).stories || [];
}

function savePathStory(periodId, story) {
    const pid = periodId || getCurrentPeriodId();
    if (!pid || !story?.userId || !story?.result) return;
    const store = getPathStoriesStore(pid);
    const uid = String(story.userId).trim();
    const idx = store.stories.findIndex(s => String(s.userId) === uid);
    const entry = {
        userId: uid,
        seq: story.seq ?? null,
        feedback: story.feedback || '',
        feedbackTime: story.feedbackTime || '',
        result: story.result,
        savedAt: new Date().toISOString(),
        forReport: true
    };
    if (idx >= 0) {
        entry.forReport = store.stories[idx].forReport !== false;
        store.stories[idx] = entry;
    } else {
        store.stories.push(entry);
    }
    localStorage.setItem(LS_PATH_PREFIX + pid, JSON.stringify(store));
    return entry;
}

function setPathStoryForReport(periodId, userId, forReport) {
    const store = getPathStoriesStore(periodId);
    const uid = String(userId).trim();
    const s = store.stories.find(x => String(x.userId) === uid);
    if (s) {
        s.forReport = forReport;
        localStorage.setItem(LS_PATH_PREFIX + periodId, JSON.stringify(store));
    }
}

function buildPathStoriesReportText(periodId, onlySelected = true) {
    const stories = getPathStoriesForPeriod(periodId).filter(s => !onlySelected || s.forReport !== false);
    if (!stories.length) return '';
    const lines = ['# 典型用户故事（路径分析）', ''];
    stories.forEach((s, i) => {
        lines.push(`## 用户 ${s.userId}`);
        if (s.feedbackTime) lines.push(`- 反馈时间：${s.feedbackTime}`);
        if (s.feedback) lines.push(`- 反馈原文：${s.feedback}`);
        lines.push('');
        lines.push(s.result);
        lines.push('');
    });
    return lines.join('\n').trim();
}

function syncPathToReportUI(periodId) {
    const pid = periodId || document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
    if (!pid) return;
    ensureReportPeriodInSelect(pid);
    refreshReportPeriodSelect();
    const reportSel = document.getElementById('reportPeriod');
    if (reportSel) reportSel.value = pid;
    renderReportPathStories(pid);
    const pathTa = document.getElementById('reportPaths');
    if (pathTa) pathTa.value = buildPathStoriesReportText(pid, true);
    if (document.getElementById('tab-report')?.classList.contains('active')) {
        loadReportPeriodData(pid);
    }
}

function updatePathSaveButtonState() {
    const btn = document.getElementById('pathSaveBtn');
    const hint = document.getElementById('pathSaveHint');
    if (!btn) return;
    const body = document.getElementById('pathBody');
    const hasContent = Boolean(body?.innerHTML?.trim());
    if (!pendingPathDraft?.result || !hasContent) {
        btn.disabled = true;
        btn.textContent = '保存至汇总报告';
        if (hint) {
            hint.hidden = true;
            hint.textContent = '';
        }
        return;
    }
    const periodId = pendingPathDraft.periodId
        || document.getElementById('pathPeriod')?.value
        || getCurrentPeriodId();
    const existing = getPathStoriesForPeriod(periodId).find(
        s => String(s.userId) === String(pendingPathDraft.userId)
    );
    const unchanged = existing
        && existing.result === pendingPathDraft.result
        && pendingPathDraft.saved;
    if (unchanged) {
        btn.disabled = true;
        btn.textContent = '已保存';
        if (hint) {
            hint.hidden = false;
            hint.textContent = `用户 ${pendingPathDraft.userId} 已同步至汇总报告，可继续分析其他用户`;
        }
    } else {
        btn.disabled = false;
        btn.textContent = existing ? '更新保存' : '保存至汇总报告';
        if (hint) {
            hint.hidden = false;
            hint.textContent = '保存后同步至「汇总报告」典型用户故事，同一用户再次保存将覆盖';
        }
    }
}

function savePendingPathToReport() {
    if (!pendingPathDraft?.result) return toast('没有可保存的路径分析结果', 'err');
    const periodId = pendingPathDraft.periodId
        || document.getElementById('pathPeriod')?.value
        || getCurrentPeriodId();
    if (!periodId) return toast('请先选择反馈周期', 'err');
    savePathStory(periodId, pendingPathDraft);
    pendingPathDraft.saved = true;
    syncPathToReportUI(periodId);
    renderPathSavedList(periodId);
    updatePathSaveButtonState();
    const n = getPathStoriesForPeriod(periodId).length;
    toast(`已保存用户 ${pendingPathDraft.userId}（本周期共 ${n} 条路径案例）`, 'ok');
}

function renderPathSavedList(periodId) {
    const list = document.getElementById('pathSavedList');
    const empty = document.getElementById('pathSavedEmpty');
    if (!list) return;
    const pid = periodId || document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
    const stories = getPathStoriesForPeriod(pid);
    if (!stories.length) {
        list.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;
    list.innerHTML = stories.map(s => {
        const time = s.feedbackTime ? displayItemTime(s.feedbackTime) : '';
        const preview = (s.feedback || '').slice(0, 24);
        const savedAt = s.savedAt
            ? new Date(s.savedAt).toLocaleString('zh-CN', { hour12: false })
            : '';
        return `<li class="path-saved-item">
            <button type="button" class="path-saved-load" data-uid="${esc(s.userId)}">
                <span class="path-saved-main">${esc(s.userId)}</span>
                <span class="path-saved-meta">${esc(time)}${preview ? ` · ${esc(preview)}` : ''}</span>
                ${savedAt ? `<span class="path-saved-at">保存于 ${esc(savedAt)}</span>` : ''}
            </button>
        </li>`;
    }).join('');
    list.querySelectorAll('.path-saved-load').forEach(btn => {
        btn.addEventListener('click', () => loadSavedPathStory(pid, btn.dataset.uid));
    });
}

function loadSavedPathStory(periodId, userId) {
    const uid = String(userId || '').trim();
    const story = getPathStoriesForPeriod(periodId).find(s => String(s.userId) === uid);
    if (!story) return;
    showResultPanel('pathResult', 'pathBody', story.result);
    pendingPathDraft = {
        periodId,
        userId: uid,
        seq: story.seq,
        feedback: story.feedback,
        feedbackTime: story.feedbackTime,
        result: story.result,
        saved: true
    };
    updatePathSaveButtonState();
}

function renderReportPathStories(periodId) {
    const box = document.getElementById('reportPathStories');
    const emptyEl = document.getElementById('reportPathStoriesEmpty');
    if (!box) return;
    const stories = getPathStoriesForPeriod(periodId);
    if (!stories.length) {
        box.innerHTML = '';
        if (emptyEl) emptyEl.hidden = false;
        return;
    }
    if (emptyEl) emptyEl.hidden = true;
    box.innerHTML = stories.map(s => {
        const checked = s.forReport !== false ? 'checked' : '';
        const time = s.feedbackTime ? displayItemTime(s.feedbackTime) : '—';
        return `<label class="report-story-item">
            <input type="checkbox" class="report-story-cb" data-uid="${esc(s.userId)}" ${checked} aria-label="纳入周报">
            <span class="report-story-uid" title="用户 ID">${esc(s.userId)}</span>
            <span class="report-story-time" title="反馈时间">${esc(time)}</span>
        </label>`;
    }).join('');
    box.querySelectorAll('.report-story-cb').forEach(cb => {
        cb.addEventListener('change', () => {
            const pid = document.getElementById('reportPeriod')?.value || getCurrentPeriodId();
            setPathStoryForReport(pid, cb.dataset.uid, cb.checked);
            const pathTa = document.getElementById('reportPaths');
            if (pathTa) pathTa.value = buildPathStoriesReportText(pid, true);
        });
    });
}

function loadReportPeriodData(periodId) {
    const pid = periodId || document.getElementById('reportPeriod')?.value;
    if (!pid) return;
    const ta = document.getElementById('reportClassified');
    const text = buildClassifiedReportText(pid);
    const pathText = buildPathStoriesReportText(pid, true);
    if (ta) ta.value = text;
    renderReportPathStories(pid);
    const pathTa = document.getElementById('reportPaths');
    if (pathTa) pathTa.value = pathText;
    const ph = document.getElementById('reportResultPlaceholder');
    const hasMaterial = Boolean(text?.trim() || pathText?.trim());
    if (!hasMaterial) {
        if (ph) {
            ph.hidden = false;
            ph.textContent = '请先在「反馈分类」完成 AI 分析并点击「确认分类」，或在「路径分析」保存路径案例';
        }
        toast('该周期暂无可汇总的数据', 'info');
    } else if (ph && !document.getElementById('reportBody')?.innerHTML?.trim()) {
        ph.hidden = false;
        ph.textContent = '材料已就绪，点击「生成周报」后结果将显示于此';
    }
}

async function onReportTabShown() {
    if (!feedbackPeriods.length) await loadFeedbackPeriodsConfig();
    refreshReportPeriodSelect();
    const sel = document.getElementById('reportPeriod');
    let pid = getCurrentPeriodId()
        || document.getElementById('pathPeriod')?.value
        || sel?.value;
    if (pid && isPeriodReportable(pid)) ensureReportPeriodInSelect(pid);
    refreshReportPeriodSelect();
    if (sel && pid && ![...sel.options].some(o => o.value === pid)) {
        const first = [...sel.options].find(o => o.value);
        pid = first?.value || pid;
    }
    if (sel && pid) sel.value = pid;
    if (pid) {
        loadReportPeriodData(pid);
        restoreSavedReport(pid);
    } else {
        renderReportPathStories('');
        const ph = document.getElementById('reportResultPlaceholder');
        if (ph) {
            ph.hidden = false;
            ph.textContent = '请先在「反馈分类」确认分类，或在「路径分析」保存路径案例后，再选择周期';
        }
    }
}

function getNeedPathUsersForPeriod(periodId) {
    return getPublishedClassifyItems(periodId).filter(
        i => i.needPath === true && i.userId && String(i.userId).trim() !== '—'
    );
}

async function loadPeriodBehaviorIndex(periodId) {
    const period = getPeriodById(periodId);
    const url = period?.indexUrl || WEEK_DATA.indexUrl;
    if (!url || location.protocol === 'file:') return false;
    try {
        const res = await fetch(url + '?_=' + Date.now());
        if (res.ok) {
            weekIndex = await res.json();
            return true;
        }
    } catch (_) { /* ignore */ }
    return false;
}

async function ensureWeekIndexForPath() {
    if (location.protocol === 'file:') return false;
    const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
    if (!periodId) return false;
    if (weekIndex?.id === periodId) return true;
    return loadPeriodBehaviorIndex(periodId);
}

function fillPathNeedPathUserSelect() {
    const sel = document.getElementById('pathNeedPathUser');
    if (!sel) return;
    const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
    const users = getNeedPathUsersForPeriod(periodId);
    sel.innerHTML = users.length
        ? '<option value="">— 选择用户 —</option>'
        : '<option value="">该周期暂无勾选「需查路径」的用户</option>';
    users.forEach(it => {
        const uid = String(it.userId).trim();
        const opt = document.createElement('option');
        opt.value = uid;
        const timeStr = displayItemTime(it.time);
        const timeNorm = timeStr !== '—' ? timeStr : '';
        const preview = (it.message || '').slice(0, 20);
        opt.textContent = timeNorm
            ? `${uid} · ${timeNorm}`
            : `${uid}${preview ? ` · ${preview}` : ''}`.trim();
        opt.dataset.feedbackTime = timeNorm;
        sel.appendChild(opt);
    });
}

function refreshPathFillUI() {
    refreshPathPeriodSelect();
    fillPathNeedPathUserSelect();
    refreshReportPeriodSelect();
}

function getPathFillMode() {
    return document.querySelector('input[name="pathFillMode"]:checked')?.value || 'filter';
}

function updatePathFillModeUI() {
    const mode = getPathFillMode();
    const filterBlock = document.getElementById('pathFilterBlock');
    const manualBlock = document.getElementById('pathManualBlock');
    if (filterBlock) filterBlock.hidden = mode !== 'filter';
    if (manualBlock) manualBlock.hidden = mode !== 'manual';
}

function setPathLogCountDisplay(rows) {
    const v = rows ? String(rows) : '';
    const a = document.getElementById('pathLogCount');
    const b = document.getElementById('pathLogCountManual');
    if (a) a.value = v;
    if (b) b.value = v;
}

function getActivePathUserId() {
    if (getPathFillMode() === 'filter') {
        return document.getElementById('pathNeedPathUser')?.value.trim() || '';
    }
    return document.getElementById('pathUid')?.value.trim() || '';
}

async function onPathPeriodChange(periodId) {
    if (!periodId) return;
    currentPeriodId = periodId;
    localStorage.setItem(LS_CURRENT_PERIOD, periodId);
    await loadPeriodBehaviorIndex(periodId);
    fillPathNeedPathUserSelect();
    const needSel = document.getElementById('pathNeedPathUser');
    if (needSel) needSel.value = '';
    pathLogStore = '';
    const logTa = document.getElementById('pathLog');
    if (logTa) logTa.value = '';
    setPathLogCountDisplay('');
    updatePathTimeHint(null, '');
    pendingPathDraft = null;
    renderPathSavedList(periodId);
    updatePathSaveButtonState();
}

async function applyPathNeedPathUserSelection(userId) {
    const uid = String(userId || '').trim();
    if (!uid) return;
    if (isFileProtocol()) {
        if (behaviorLogCsvCache.size === 0) {
            const ok = await pickBehaviorLogDirectory();
            if (!ok) return;
        }
    } else {
        const ok = await ensureWeekIndexForPath();
        if (!ok) toast('行为日志索引加载失败，请运行 python scripts/sync_test_fixture.py 同步 测试文件/', 'err');
    }
    const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
    const items = getPublishedClassifyItems(periodId);
    const item = items.find(i => String(i.userId).trim() === uid);
    const u = weekIndex?.users?.find(x => String(x.user_id) === uid);
    const uidEl = document.getElementById('pathUid');
    if (uidEl) uidEl.value = uid;
    applyPathUserFields(uid, u, item);
    await loadUserPathById(uid, { silent: false });
}

async function initWeekData() {
    await loadFeedbackPeriodsConfig();
    currentPeriodId = localStorage.getItem(LS_CURRENT_PERIOD) || feedbackPeriods[0]?.id || 'week_2026_w10';
    await loadPeriodBehaviorIndex(currentPeriodId);
    refreshPathFillUI();
}

function filterCsvLinesForUser(csvText, uid) {
    if (!csvText || !uid) return { text: '', rows: 0 };
    const lines = csvText.split(/\r?\n/);
    if (!lines.length) return { text: '', rows: 0 };
    const header = lines[0];
    const uidStr = String(uid).trim();
    const out = [header];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const first = line.split(',')[0].replace(/^"|"$/g, '').trim();
        if (first === uidStr) out.push(line);
    }
    return { text: out.join('\n'), rows: Math.max(0, out.length - 1) };
}

function parseCsvHeaderIndex(headerLine) {
    return headerLine.split(',').map(c => c.replace(/^"|"$/g, '').trim().toLowerCase());
}

function findCsvColumnIndex(headers, patterns) {
    for (let i = 0; i < headers.length; i++) {
        const h = headers[i];
        if (patterns.some(p => h === p || h.includes(p))) return i;
    }
    return -1;
}

function parseLogTimestamp(value) {
    const s = String(value || '').trim().replace(/^"|"$/g, '');
    if (!s) return null;
    const d = new Date(s.includes('T') ? s : s.replace(/-/g, '/'));
    return Number.isNaN(d.getTime()) ? null : d;
}

function resolveFeedbackTime(batchItem, weekUser, period) {
    const tryNorm = (raw) => {
        if (raw == null || raw === '' || raw === '—') return '';
        const n = normalizeFeedbackTime(raw);
        if (n && !isExcelSerialString(n)) return n;
        return '';
    };
    return tryNorm(batchItem?.time)
        || tryNorm(weekUser?.feedback_time)
        || tryNorm(weekIndex?.default_feedback_time)
        || tryNorm(period?.defaultFeedbackTime)
        || '';
}

function updatePathTimeHint(batchItem, resolvedTime, weekUser) {
    const el = document.getElementById('pathTimeHint');
    if (!el) return;
    let src = '周期默认';
    if (batchItem?.time && batchItem.time !== '—') src = '分类表';
    else if (weekUser?.feedback_time) src = '周期索引';
    if (resolvedTime) {
        el.textContent = `已同步自${src} · 将截取反馈前 ${PATH_LOG_WINDOW_MINUTES} 分钟内行为日志`;
    } else {
        el.textContent = '请填写反馈时间，用于定位行为日志时间窗口';
    }
}

function getClassifyItemForUser(periodId, uid) {
    const id = String(uid || '').trim();
    if (!id) return null;
    return getPublishedClassifyItems(periodId).find(i => String(i.userId).trim() === id)
        || (periodId === getCurrentPeriodId()
            ? batchItems.find(i => String(i.userId).trim() === id)
            : null)
        || null;
}

/**
 * 按反馈时间窗口筛选行为日志（反馈时刻及之前 windowMinutes 分钟）
 */
function filterBehaviorLogByFeedbackTime(csvText, feedbackTime, windowMinutes = PATH_LOG_WINDOW_MINUTES) {
    if (!csvText?.trim() || !feedbackTime?.trim()) {
        return { text: csvText || '', rows: 0, filtered: false };
    }
    const feedbackDt = parseLogTimestamp(feedbackTime);
    if (!feedbackDt) return { text: csvText, rows: 0, filtered: false };

    const lines = csvText.split(/\r?\n/).filter(l => l.length);
    if (lines.length < 2) return { text: csvText, rows: 0, filtered: false };

    const headers = parseCsvHeaderIndex(lines[0]);
    let tsIdx = findCsvColumnIndex(headers, ['timestamp', '时间', 'time', 'event_time', 'xyio_client_time']);
    if (tsIdx < 0) tsIdx = 1;

    const startDt = new Date(feedbackDt.getTime() - windowMinutes * 60 * 1000);
    const out = [lines[0]];
    let rows = 0;
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const cols = line.split(',');
        const ts = parseLogTimestamp(cols[tsIdx]);
        if (!ts) continue;
        if (ts >= startDt && ts <= feedbackDt) {
            out.push(line);
            rows++;
        }
    }
    return { text: out.join('\n'), rows, filtered: true, windowMinutes };
}

function applyBehaviorLogForPath(csvText, feedbackTime) {
    const ft = normalizeFeedbackTime(feedbackTime) || String(feedbackTime || '').trim();
    const filtered = filterBehaviorLogByFeedbackTime(csvText, ft);
    const fullRows = Math.max(0, csvText.split(/\r?\n/).filter(l => l.trim()).length - 1);
    if (filtered.filtered && filtered.rows === 0 && fullRows > 0) {
        setPathLogContent(csvText, fullRows);
        return {
            ...filtered,
            rowCount: fullRows,
            rows: fullRows,
            usedFallback: true,
            filtered: false,
            windowMinutes: filtered.windowMinutes || PATH_LOG_WINDOW_MINUTES
        };
    }
    const useText = filtered.filtered ? filtered.text : csvText;
    const rowCount = filtered.filtered ? filtered.rows : fullRows;
    setPathLogContent(useText, rowCount);
    return { ...filtered, rowCount };
}

function setPathLogContent(fullText, rowCount) {
    pathLogStore = fullText || '';
    const ta = document.getElementById('pathLog');
    if (!ta) return;
    const lines = pathLogStore.split(/\r?\n/).filter(l => l.trim());
    const dataRows = Math.max(0, lines.length - (lines.length ? 1 : 0));
    const rows = rowCount != null ? rowCount : dataRows;
    setPathLogCountDisplay(rows);
    const previewMax = 60;
    if (lines.length <= previewMax) {
        ta.value = pathLogStore;
    } else {
        ta.value = lines.slice(0, previewMax).join('\n')
            + `\n\n… 共 ${rows} 条（分析使用全部已加载数据，无需全部显示在框内）…`;
    }
}

function applyPathUserFields(uid, u, batchItem) {
    const fbEl = document.getElementById('pathFeedback');
    const timeEl = document.getElementById('pathTime');
    const period = getPeriodById(document.getElementById('pathPeriod')?.value || getCurrentPeriodId());
    const item = batchItem || getClassifyItemForUser(period?.id || getCurrentPeriodId(), uid);
    const weekUser = u || weekIndex?.users?.find(x => String(x.user_id) === String(uid).trim());

    if (item?.message && fbEl) fbEl.value = item.message;
    else if (weekUser?.feedback_text && fbEl) fbEl.value = weekUser.feedback_text;

    let resolvedTime = resolveFeedbackTime(item, weekUser, period)
        || '2026-03-11 12:00:00';
    resolvedTime = normalizeFeedbackTime(resolvedTime) || resolvedTime;
    if (timeEl) timeEl.value = resolvedTime;
    updatePathTimeHint(item, resolvedTime, weekUser);
    return resolvedTime;
}

async function loadUserPathById(userId, { silent } = {}) {
    const uid = String(userId || '').trim();
    if (!uid) return;

    if (location.protocol !== 'file:') {
        const loaded = await ensureWeekIndexForPath();
        if (!loaded && !silent) {
            toast('行为日志索引未加载，请确认已运行 sync_test_fixture.py 同步 测试文件/', 'err');
        }
    }

    const uidEl = document.getElementById('pathUid');
    if (uidEl) uidEl.value = uid;
    const needSel = document.getElementById('pathNeedPathUser');
    if (needSel && [...needSel.options].some(o => o.value === uid)) needSel.value = uid;

    const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
    const batchItem = getClassifyItemForUser(periodId, uid);
    const u = weekIndex?.users?.find(x => String(x.user_id) === uid);
    let feedbackTime = applyPathUserFields(uid, u, batchItem);
    feedbackTime = normalizeFeedbackTime(feedbackTime) || feedbackTime;

    const localCsv = getUserLogFromLocalCache(uid);
    if (localCsv) {
        applyLoadedPathLog(uid, localCsv, feedbackTime, silent);
        return;
    }

    if (isFileProtocol()) {
        const ready = await ensureLocalBehaviorLogs({ promptIfEmpty: !silent });
        const csv = ready ? getUserLogFromLocalCache(uid) : '';
        if (csv) {
            applyLoadedPathLog(uid, csv, feedbackTime, silent);
            return;
        }
        if (!silent) {
            toast('未找到该用户日志，请重新选择包含 week_*_users 的文件夹', 'err');
        }
        return;
    }

    if (u?.log_file && u.log_rows > 0) {
        showLoading('加载用户行为日志...');
        try {
            const res = await fetch(u.log_file + '?_=' + Date.now());
            if (!res.ok) throw new Error('日志文件不存在，请重新运行 sync_test_fixture.py');
            const body = await res.text();
            if (isSpreadsheetGarbage(body)) {
                throw new Error('日志加载异常，请用 python -m http.server 8080 启动本地服务');
            }
            const applied = applyBehaviorLogForPath(body, feedbackTime);
            if (!silent) {
                const win = applied.windowMinutes || PATH_LOG_WINDOW_MINUTES;
                if (applied.usedFallback) {
                    toast(`反馈前 ${win} 分钟内无记录，已加载全部 ${applied.rowCount} 条日志供分析`, 'ok');
                } else if (applied.filtered && applied.rows > 0) {
                    toast(`已加载用户 ${uid}：反馈前 ${win} 分钟内 ${applied.rows} 条日志`, 'ok');
                } else if (applied.filtered && applied.rows === 0) {
                    toast(`已加载日志，但反馈前 ${win} 分钟内无记录，请核对反馈时间`, 'err');
                } else {
                    toast(`已加载用户 ${uid} 的 ${applied.rowCount} 条行为记录（未按时间筛选）`, 'ok');
                }
            }
            return;
        } catch (e) {
            if (!silent) toast(e.message, 'err');
        } finally {
            hideLoading();
        }
    }

    if (masterLogCsvText) {
        const { text, rows } = filterCsvLinesForUser(masterLogCsvText, uid);
        if (rows > 0) {
            const ft = document.getElementById('pathTime')?.value.trim() || feedbackTime;
            const applied = applyBehaviorLogForPath(text, ft);
            if (!silent) {
                toast(applied.filtered && applied.rows > 0
                    ? `已从上传文件截取用户 ${uid} 反馈前 ${applied.windowMinutes || PATH_LOG_WINDOW_MINUTES} 分钟内 ${applied.rows} 条日志`
                    : `已从上传文件筛选用户 ${uid} 的 ${applied.rowCount} 条日志`, 'ok');
            }
            return;
        }
    }

    if (u && (!u.log_rows || !u.log_file)) {
        setPathLogContent('', 0);
        if (!silent) toast('该用户本周无行为日志', 'err');
        return;
    }

    if (!silent) toast(`未找到用户 ${uid} 的预置日志，可上传全量 CSV 后将自动按 ID 筛选`, 'err');
}

function scheduleLoadUserPathById(userId) {
    clearTimeout(pathUidLoadTimer);
    pathUidLoadTimer = setTimeout(() => loadUserPathById(userId, { silent: false }), 450);
}

function updatePathLocalModeUI() {
    const btn = document.getElementById('pathPickLogDirBtn');
    if (btn) btn.hidden = !isFileProtocol();
}

async function onPathTabShown() {
    updatePathLocalModeUI();
    if (!isFileProtocol()) {
        await loadFeedbackPeriodsConfig();
        const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
        await loadPeriodBehaviorIndex(periodId);
    }
    refreshPathFillUI();
    updatePathFillModeUI();
    const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
    renderPathSavedList(periodId);
    updatePathSaveButtonState();
    const uid = getActivePathUserId();
    if (uid && !pathLogStore) scheduleLoadUserPathById(uid);
}

async function loadWeekFeedback() {
    const periodId = 'week_2026_w10';
    showLoading('加载测试文件...');
    try {
        let rows = null;

        if (!isFileProtocol()) {
            rows = await fetchTestFeedbackRows();
        }

        if (!rows?.length && isFileProtocol()) {
            hideLoading();
            rows = await pickTestFixtureFile();
            showLoading('加载测试文件...');
        }

        if (!rows?.length && !isFileProtocol()) {
            hideLoading();
            toast(`无法读取 ${getTestFeedbackXlsxUrl()}，请确认已用启动工具.bat 打开`, 'err');
            rows = await pickTestFixtureFile();
            showLoading('加载测试文件...');
        }

        if (rows?.length) {
            applyFeedbackRowsToUI(rows, periodId);
            if (!isFileProtocol()) await loadPeriodBehaviorIndex(periodId);
            toast(`已加载测试文件 ${batchItems.length} 条（26年第10周在线反馈），可直接预览或批量分析`, 'ok');
            return;
        }

        if (isFileProtocol()) {
            throw new Error('未加载到数据。请双击「启动工具.bat」打开页面，或手动选择测试 xlsx');
        }

        const urls = [
            getPeriodById(periodId)?.feedbackCsv || 'data/input/week_2026_w10_feedback.csv',
            getPeriodById(periodId)?.feedbackAiTxt || 'data/input/week_2026_w10_feedback_ai.txt'
        ];
        let text = '';
        for (const url of urls) {
            const res = await fetch(url + '?_=' + Date.now());
            if (!res.ok) continue;
            const body = await res.text();
            if (isSpreadsheetGarbage(body)) continue;
            text = url.endsWith('.csv') ? feedbackCsvToAiText(body) : body;
            break;
        }
        if (!text) {
            throw new Error('未找到测试数据。请运行: python scripts/sync_test_fixture.py');
        }
        const csvRes = await fetch(urls[0] + '?_=' + Date.now());
        if (csvRes.ok && typeof XLSX !== 'undefined') {
            const csv = await csvRes.text();
            const wb = XLSX.read(csv, { type: 'string', cellDates: true });
            rows = sheetToJsonRows(wb.Sheets[wb.SheetNames[0]]);
            applyFeedbackRowsToUI(rows, periodId);
            await loadPeriodBehaviorIndex(periodId);
            toast(`已加载备用 CSV ${batchItems.length} 条`, 'ok');
            return;
        }
        setFeedbackText(text);
        hideClassifyBelow();
        currentPeriodId = periodId;
        localStorage.setItem(LS_CURRENT_PERIOD, currentPeriodId);
        refreshPathFillUI();
        toast(`已加载 ${batchItems.length} 条`, 'ok');
    } catch (e) {
        toast(e.message, 'err');
    } finally {
        hideLoading();
    }
}

async function loadWeekUserPath(userId) {
    return loadUserPathById(userId);
}

// ==================== 导航 ====================
function activateTab(tabId) {
    document.body.dataset.module = tabId || '';
    document.querySelectorAll('.nav li[data-tab], .nav-settings-btn[data-tab]').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === tabId);
    });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('tab-' + tabId);
    if (panel) panel.classList.add('active');
    if (tabId === 'path') onPathTabShown();
    if (tabId === 'report') onReportTabShown();
}

function initSettingsPaneNav() {
    document.querySelectorAll('.settings-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const pane = btn.dataset.settingsPane;
            document.querySelectorAll('.settings-tab').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.querySelectorAll('.settings-pane').forEach(p => p.classList.remove('active'));
            const el = document.getElementById('settings-pane-' + pane);
            if (el) el.classList.add('active');
        });
    });
}

function initNav() {
    document.querySelectorAll('.nav li[data-tab], .nav-settings-btn[data-tab]').forEach(el => {
        el.addEventListener('click', () => activateTab(el.dataset.tab));
    });
    initSettingsPaneNav();
}

// ==================== API 设置 ====================
function initSettings() {
    // 加载已保存设置
    const saved = JSON.parse(localStorage.getItem('cz_settings') || '{}');
    if (saved.provider) document.getElementById('aiProvider').value = saved.provider;
    if (saved.model) document.getElementById('aiModel').value = saved.model;
    if (saved.apiKey) document.getElementById('apiKey').value = saved.apiKey;
    if (saved.customBase) document.getElementById('customBase').value = saved.customBase;

    // 提供商切换
    document.getElementById('aiProvider').addEventListener('change', function() {
        const v = this.value;
        document.getElementById('customBaseRow').style.display = v === 'custom' ? '' : 'none';
        if (v === 'openai') document.getElementById('aiModel').value = 'gpt-4o';
        if (v === 'deepseek') document.getElementById('aiModel').value = 'deepseek-chat';
        if (v === 'zhipu') document.getElementById('aiModel').value = 'glm-4-flash';
    });
    // 触发一次
    document.getElementById('aiProvider').dispatchEvent(new Event('change'));

    // 保存
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        const s = {
            provider: document.getElementById('aiProvider').value,
            model: document.getElementById('aiModel').value,
            apiKey: document.getElementById('apiKey').value,
            customBase: document.getElementById('customBase').value
        };
        localStorage.setItem('cz_settings', JSON.stringify(s));
        document.getElementById('settingsStatus').textContent = '✅ 已保存';
        toast('设置已保存', 'ok');
    });

    // 测试
    document.getElementById('testApiBtn').addEventListener('click', async () => {
        try {
            showLoading('测试 API 连接...');
            const r = await callAI('你好，请回复"连接成功"四个字。');
            hideLoading();
            if (r) { toast('✅ API 连接成功', 'ok'); document.getElementById('settingsStatus').textContent = '✅ 连接成功'; }
        } catch (e) {
            hideLoading();
            toast('❌ 连接失败: ' + e.message, 'err');
            document.getElementById('settingsStatus').textContent = '❌ ' + e.message;
        }
    });
}

function getAPIConfig() {
    const saved = JSON.parse(localStorage.getItem('cz_settings') || '{}');
    const provider = saved.provider || document.getElementById('aiProvider').value;
    const model = saved.model || document.getElementById('aiModel').value;
    const apiKey = saved.apiKey || document.getElementById('apiKey').value;
    const customBase = saved.customBase || document.getElementById('customBase').value;

    let baseUrl;
    if (provider === 'openai') baseUrl = 'https://api.openai.com/v1';
    else if (provider === 'deepseek') baseUrl = 'https://api.deepseek.com/v1';
    else if (provider === 'zhipu') baseUrl = 'https://open.bigmodel.cn/api/paas/v4';
    else baseUrl = customBase;

    if (!apiKey) throw new Error('请先在 API 设置中填写 API Key');
    return { baseUrl, model, apiKey };
}

// ==================== API 错误文案 ====================
function friendlyApiError(message) {
    if (!message) return '请求失败';
    const raw = String(message);
    const m = raw.toLowerCase();
    if (/insufficient\s*balance|insufficient_quota|余额不足|余额不够/.test(m)) {
        return 'API 余额不足，请充值或更换 API 提供方后重试';
    }
    if (/invalid.*api.*key|incorrect.*api.*key|authentication|unauthorized|401/.test(m)) {
        return 'API Key 无效或未授权，请在「设置」中检查';
    }
    if (/rate\s*limit|too many requests|429/.test(m)) {
        return '请求过于频繁，请稍后重试';
    }
    if (/timeout|timed out/.test(m)) {
        return '请求超时，请稍后重试';
    }
    return raw;
}

function isFatalApiError(message) {
    const m = String(message || '').toLowerCase();
    return /insufficient\s*balance|insufficient_quota|余额不足|invalid.*api.*key|incorrect.*api.*key|unauthorized/.test(m);
}

// ==================== AI 调用 ====================
async function callAI(userMessage, systemPrompt = '', maxTokens = 8000) {
    const cfg = getAPIConfig();
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: userMessage });

    const resp = await fetch(cfg.baseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cfg.apiKey
        },
        body: JSON.stringify({
            model: cfg.model,
            messages: messages,
            temperature: 0.3,
            max_tokens: maxTokens
        })
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(friendlyApiError(err.error?.message || `API 错误 ${resp.status}`));
    }

    const data = await resp.json();
    return data.choices[0].message.content;
}

// ==================== 批量分类 ====================
function normalizeRowKeys(row) {
    const out = {};
    for (const [k, v] of Object.entries(row)) {
        const key = String(k).replace(/^\ufeff/, '').trim();
        out[key] = v;
    }
    return out;
}

function cellToStr(v) {
    if (v == null || v === '') return '';
    if (typeof v === 'number' && Number.isFinite(v)) {
        return String(Math.round(v) === v ? Math.trunc(v) : v);
    }
    const s = String(v).trim();
    if (s === 'nan' || s === 'NaN') return '';
    return s.replace(/\.0$/, '');
}

/** Excel 序列日期（如 46090.83）→ yyyy-MM-dd HH:mm:ss */
function normalizeFeedbackTime(raw) {
    if (raw == null || raw === '') return '';
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
        return formatDateTimeLocal(raw);
    }
    if (typeof raw === 'number' && Number.isFinite(raw)) {
        if (raw > 20000 && raw < 120000) return excelSerialToDateTime(raw);
        if (raw > 1e12) return formatDateTimeLocal(new Date(raw));
        if (raw > 1e9 && raw < 1e12) return formatDateTimeLocal(new Date(raw * 1000));
    }
    const s = String(raw).trim();
    if (!s || s === '—') return '';
    const num = parseFloat(s);
    if (/^\d{4,6}(\.\d+)?$/.test(s) && Number.isFinite(num) && num > 20000 && num < 120000) {
        return excelSerialToDateTime(num);
    }
    const d = new Date(s.includes('T') ? s : s.replace(/-/g, '/'));
    return Number.isNaN(d.getTime()) ? s : formatDateTimeLocal(d);
}

function formatDateTimeLocal(d) {
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function excelSerialToDateTime(serial) {
    const whole = Math.floor(serial);
    const frac = serial - whole;
    const ms = (whole - 25569) * 86400000 + Math.round(frac * 86400000);
    return formatDateTimeLocal(new Date(ms));
}

function displayItemTime(time) {
    const t = normalizeFeedbackTime(time);
    if (t) return t;
    return time && time !== '—' ? String(time) : '—';
}

function getRawField(row, ...names) {
    const normalized = normalizeRowKeys(row);
    const keys = Object.keys(normalized);
    for (const name of names) {
        const exact = keys.find(key => key === name || key.toLowerCase() === name.toLowerCase());
        if (exact != null && normalized[exact] != null && normalized[exact] !== '') {
            return normalized[exact];
        }
    }
    for (const name of names) {
        const fuzzy = keys.find(key => key.includes(name) || name.includes(key));
        if (fuzzy != null && normalized[fuzzy] != null && normalized[fuzzy] !== '') {
            return normalized[fuzzy];
        }
    }
    return null;
}

function pickField(row, ...names) {
    const normalized = normalizeRowKeys(row);
    const keys = Object.keys(normalized);
    for (const name of names) {
        const exact = keys.find(key => key === name || key.toLowerCase() === name.toLowerCase());
        if (exact != null) {
            const val = cellToStr(normalized[exact]);
            if (val) return val;
        }
    }
    for (const name of names) {
        const fuzzy = keys.find(key => key.includes(name) || name.includes(key));
        if (fuzzy != null) {
            const val = cellToStr(normalized[fuzzy]);
            if (val) return val;
        }
    }
    return '';
}

function pickLabelL1(row) {
    return pickField(row, '一级分类标签', '一级问题标签', '一级分类', 'label_l1', 'category_l1', '一级问题');
}

function pickLabelL2(row) {
    return pickField(row, '二级分类标签', '二级问题标签', '二级分类', 'label_l2', 'category_l2');
}

function pickTimeFromRow(row) {
    const raw = getRawField(row, '反馈时间', 'feedback_time', '时间', '提交时间', '留言时间', 'timestamp', 'create_time');
    return normalizeFeedbackTime(raw) || '';
}

function sheetToJsonRows(sheet) {
    if (typeof XLSX === 'undefined') return [];
    return XLSX.utils.sheet_to_json(sheet, {
        defval: '',
        raw: false,
        dateNF: 'yyyy-mm-dd hh:mm:ss'
    });
}

function rowFieldsFromFeedbackCache(item) {
    if (!feedbackRowsCache?.length) return {};
    for (const row of feedbackRowsCache) {
        const norm = normalizeRowKeys(row);
        const uid = pickField(norm, '用户ID', 'user_id', 'userid');
        const msg = cleanFeedbackMsg(pickField(norm, '有效信息', 'feedback_text', '反馈内容', '留言', 'content'));
        if ((uid && String(uid) === String(item.userId)) || (msg && msg === item.message)) {
            return {
                labelL1: pickLabelL1(norm),
                labelL2: pickLabelL2(norm),
                time: pickTimeFromRow(norm),
                membership: pickField(norm, 'membership', '用户身份', '会员身份', '会员类型')
            };
        }
    }
    return {};
}

function feedbackItemsFromRows(rows) {
    const items = [];
    let fallbackSeq = 0;
    for (const row of rows) {
        const norm = normalizeRowKeys(row);
        const msg = cleanFeedbackMsg(pickField(norm, '有效信息', 'feedback_text', '反馈内容', '留言', 'content'));
        if (!msg) continue;
        const rowSeqRaw = pickField(norm, 'seq', '序号');
        const seq = rowSeqRaw ? parseInt(rowSeqRaw, 10) : (++fallbackSeq);
        const uid = pickField(norm, '用户ID', 'user_id', 'userid');
        const membership = pickField(norm, 'membership', '用户身份', '会员身份', '会员类型');
        items.push({
            seq,
            userId: uid,
            time: pickTimeFromRow(norm) || '2026-03-11 12:00:00',
            message: msg,
            membership,
            labelL1: pickLabelL1(norm),
            labelL2: pickLabelL2(norm),
            categoryL2: '',
            relatedModule: '',
            result: '',
            resultBody: '',
            needPath: null,
            status: 'pending'
        });
    }
    return items;
}

function parseFeedbackFromText(text) {
    const items = [];
    const re = /^(\d+)\.\s*用户ID:\s*([^,]+),\s*(?:会员身份:\s*([^,]+),\s*)?时间:\s*([^,]+),\s*留言:\s*"([^"]*)"(?:（人工标注二级:\s*([^）]+)）)?/gm;
    let m;
    while ((m = re.exec(text)) !== null) {
        items.push({
            seq: parseInt(m[1], 10),
            userId: m[2].trim(),
            membership: m[3] ? m[3].trim() : '',
            time: m[4].trim(),
            message: m[5].trim(),
            labelL1: '',
            labelL2: m[6] ? m[6].trim() : '',
            categoryL2: '',
            relatedModule: '',
            result: '',
            resultBody: '',
            needPath: null,
            status: 'pending'
        });
    }
    return items;
}

function syncBatchFromText() {
    const text = document.getElementById('feedbackInput').value.trim();
    if (!text || isSpreadsheetGarbage(text)) {
        batchItems = [];
        feedbackRowsCache = null;
        renderBatchTable();
        return;
    }
    if (feedbackRowsCache && feedbackRowsCache.length) {
        const fromCache = feedbackItemsFromRows(feedbackRowsCache);
        const cacheText = feedbackRowsToAiText(feedbackRowsCache).trim();
        if (cacheText && text === cacheText) {
            batchItems = fromCache;
            renderBatchTable();
            return;
        }
    }
    const prevItems = batchItems.slice();
    let parsed = parseFeedbackFromText(text);
    if (!parsed.length && feedbackRowsCache?.length) {
        parsed = feedbackItemsFromRows(feedbackRowsCache);
    }
    if (parsed.length) {
        batchItems = parsed.map(item => {
            const prev = prevItems.find(p =>
                p.seq === item.seq ||
                (p.userId === item.userId && p.message === item.message)
            );
            const fromRow = rowFieldsFromFeedbackCache(item);
            const time = normalizeFeedbackTime(item.time)
                || fromRow.time
                || normalizeFeedbackTime(prev?.time)
                || item.time;
            return {
                ...item,
                time: time && time !== '—' ? time : '2026-03-11 12:00:00',
                membership: item.membership || fromRow.membership || prev?.membership || '',
                labelL1: fromRow.labelL1 || prev?.labelL1 || '',
                labelL2: item.labelL2 || fromRow.labelL2 || prev?.labelL2 || ''
            };
        });
    } else {
        batchItems = [];
    }
    if (batchItems.length === 0) {
        batchItems = text.split('\n').filter(l => l.trim()).map((line, i) => ({
            seq: i + 1,
            userId: '—',
            time: '—',
            message: line.trim(),
            membership: '',
            labelL2: '',
            categoryL2: '',
            relatedModule: '',
            result: '',
            resultBody: '',
            needPath: null,
            status: 'pending'
        }));
    }
    batchItems.forEach((it, i) => { it.seq = i + 1; });
    renderBatchTable();
    refreshPathFillUI();
    refreshReportPeriodSelect();
}

function parseLabeledField(text, label) {
    if (!text) return '';
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
        `(?:[-*]*\\s*)?\\*\\*${escaped}\\*\\*\\s*[：:]\\s*([^\\n]+)|(?:^|\\n)[-*]*\\s*${escaped}\\s*[：:]\\s*([^\\n]+)`,
        'm'
    );
    const m = text.match(re);
    return (m?.[1] || m?.[2] || '').trim().replace(/\*\*/g, '');
}

function parseNeedPathFromResult(text) {
    if (!text) return null;
    const v = parseLabeledField(text, '是否需查路径') || parseLabeledField(text, '是否需查用户路径');
    if (!v) return null;
    if (/❌|否|不需要|不需/.test(v) && !/✅/.test(v)) return false;
    if (/✅|✓|是|需要/.test(v)) return true;
    return null;
}

function stripStructuredFieldsFromResult(text) {
    if (!text) return '';
    const labels = [
        '二级分类', '关联模块', '用户需求', '满足状态', '判断依据',
        '资源类型', '建设优先级', '是否需查路径', '是否需查用户路径', '建议'
    ];
    let out = text;
    for (const label of labels) {
        const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        out = out
            .replace(new RegExp(`\\n?[-*]*\\s*\\*\\*${escaped}\\*\\*\\s*[：:][^\\n]*`, 'g'), '')
            .replace(new RegExp(`\\n?[-*]*\\s*${escaped}\\s*[：:][^\\n]*`, 'g'), '');
    }
    return out.trim();
}

const CATEGORY_L2_OPTIONS = ['查找资源', '内容需求', '内容错误', '无效反馈'];

function normalizeCategoryL2(value) {
    const v = (value || '').trim();
    if (v === '内容缺失') return '内容需求';
    if (v === '⚠️待确认' || v === '待确认') return '无效反馈';
    return v;
}

function ensureAiSnapshot(item) {
    if (item.status !== 'done') return;
    if (!item.aiSnapshot) {
        item.aiSnapshot = {
            categoryL2: item.categoryL2 || '',
            relatedModule: item.relatedModule || '',
            resultBody: item.resultBody || ''
        };
    }
}

function applyAnalysisResult(item) {
    item.needPath = parseNeedPathFromResult(item.result);
    item.categoryL2 = normalizeCategoryL2(parseLabeledField(item.result, '二级分类'));
    item.relatedModule = parseLabeledField(item.result, '关联模块');
    item.resultBody = stripStructuredFieldsFromResult(item.result);
    item.aiSnapshot = {
        categoryL2: item.categoryL2 || '',
        relatedModule: item.relatedModule || '',
        resultBody: item.resultBody || ''
    };
    item.manuallyRevised = false;
    item._editingResult = false;
}

function isItemFieldRevised(item, field) {
    if (!item.aiSnapshot) return false;
    const cur = field === 'categoryL2' ? item.categoryL2 : field === 'relatedModule' ? item.relatedModule : item.resultBody;
    return String(cur || '') !== String(item.aiSnapshot[field] || '');
}

function recordRevisionFromItem(item, { original_category, revised_category, reason, learned_rule }) {
    const revisions = JSON.parse(localStorage.getItem('cz_revisions') || '[]');
    revisions.push({
        feedback_id: String(item.seq),
        original_text: (item.message || '').slice(0, 200),
        original_category: original_category || item.aiSnapshot?.categoryL2 || '',
        revised_category: revised_category || item.categoryL2 || '',
        reason: reason || '分类表内修订',
        learned_rule: learned_rule || '',
        timestamp: new Date().toLocaleString('zh-CN')
    });
    localStorage.setItem('cz_revisions', JSON.stringify(revisions));
    if (learned_rule) {
        const rules = JSON.parse(localStorage.getItem('cz_rules') || '[]');
        rules.push({ rule: learned_rule, timestamp: new Date().toLocaleString('zh-CN') });
        localStorage.setItem('cz_rules', JSON.stringify(rules));
    }
    renderRules();
}

function commitBatchFieldEdit(seq, field, newValue) {
    const item = batchItems.find(i => i.seq === seq);
    if (!item || item.status !== 'done') return;
    ensureAiSnapshot(item);
    const prev = item[field];
    if (String(prev || '') === String(newValue || '')) return;

    if (field === 'categoryL2') {
        const normalized = normalizeCategoryL2(newValue);
        recordRevisionFromItem(item, {
            original_category: item.aiSnapshot.categoryL2 || prev,
            revised_category: normalized,
            reason: `修订二级分类：${item.aiSnapshot.categoryL2 || '—'} → ${normalized}`
        });
        item.categoryL2 = normalized;
    } else if (field === 'relatedModule') {
        recordRevisionFromItem(item, {
            original_category: item.categoryL2,
            revised_category: item.categoryL2,
            reason: `修订关联模块：${item.aiSnapshot.relatedModule || '—'} → ${newValue}`
        });
        item.relatedModule = newValue;
    } else if (field === 'resultBody') {
        recordRevisionFromItem(item, {
            original_category: item.categoryL2,
            revised_category: item.categoryL2,
            reason: '修订分析结论'
        });
        item.resultBody = newValue;
        item._editingResult = false;
    }
    item.manuallyRevised = true;
    saveClassifySnapshot(getCurrentPeriodId());
    refreshPathFillUI();
    updateBatchRow(seq, {});
    toast('已保存修订', 'ok');
}

function categoryL2SelectHtml(item) {
    const cur = item.categoryL2 || '';
    const opts = CATEGORY_L2_OPTIONS.map(c =>
        `<option value="${esc(c)}"${c === cur ? ' selected' : ''}>${esc(c)}</option>`
    ).join('');
    const revised = isItemFieldRevised(item, 'categoryL2');
    return `<div class="batch-edit-wrap">
        <select class="batch-edit batch-edit-l2" data-seq="${item.seq}" aria-label="二级分类">${opts}</select>
        ${revised ? '<span class="tag-revised">已改</span>' : ''}
    </div>`;
}

function categoryL2CellHtml(item) {
    if (item.status === 'running') {
        return '<span class="analysis-tag pending">分析中…</span>';
    }
    if (item.status === 'done') {
        ensureAiSnapshot(item);
        return categoryL2SelectHtml(item);
    }
    const human = item.labelL2;
    if (human) {
        return `<span class="analysis-tag analysis-tag-human">${esc(human)}</span><span class="tag-src">人工</span>`;
    }
    return '<span class="analysis-tag pending">待分析</span>';
}

function relatedModuleCellHtml(item) {
    if (item.status === 'running') {
        return '<span class="analysis-tag pending">分析中…</span>';
    }
    if (item.status === 'done') {
        ensureAiSnapshot(item);
        const revised = isItemFieldRevised(item, 'relatedModule');
        return `<div class="batch-edit-wrap">
            <input type="text" class="batch-edit batch-edit-module" data-seq="${item.seq}" value="${esc(item.relatedModule || '')}" placeholder="关联模块" aria-label="关联模块">
            ${revised ? '<span class="tag-revised">已改</span>' : ''}
        </div>`;
    }
    if (item.relatedModule) {
        return `<span class="analysis-tag analysis-tag-module">${esc(item.relatedModule)}</span>`;
    }
    return '<span class="analysis-tag pending">待分析</span>';
}

function resultBodyHtml(item) {
    if (item.status === 'done') {
        ensureAiSnapshot(item);
        if (item._editingResult) {
            const body = item.resultBody || '';
            return `<div class="cell-result-edit">
                <textarea class="batch-edit batch-edit-result" data-seq="${item.seq}" rows="6" aria-label="分析结论">${esc(body)}</textarea>
                <div class="batch-edit-actions">
                    <button type="button" class="btn btn-s batch-save-result" data-seq="${item.seq}">保存</button>
                    <button type="button" class="btn btn-s batch-cancel-result" data-seq="${item.seq}">取消</button>
                </div>
            </div>`;
        }
        const revised = isItemFieldRevised(item, 'resultBody');
        const md = item.resultBody || stripStructuredFieldsFromResult(item.result);
        return `<div class="cell-result done result-md cell-result-view">
            ${renderMd(md)}
            <button type="button" class="btn-link batch-edit-result-btn" data-seq="${item.seq}">编辑结论</button>
            ${revised ? '<span class="tag-revised">已改</span>' : ''}
        </div>`;
    }
    if (item.status === 'error') {
        const msg = friendlyApiError(item.result || '分析失败');
        return `<div class="cell-result error" title="${esc(msg)}">${esc(msg)}</div>`;
    }
    if (item.status === 'running') {
        return '<div class="cell-result running">分析中…</div>';
    }
    return '<div class="cell-result pending">待分析</div>';
}

function pathCheckHtml(item) {
    const checked = item.needPath === true;
    const cls = item.needPath === true ? 'checked' : item.needPath === false ? 'unchecked' : '';
    const title = item.needPath === null
        ? '分析后自动填充，也可手动勾选'
        : (checked ? 'AI 建议需查路径（可取消）' : 'AI 建议不需查路径（可勾选）');
    return `<label class="path-check-tag ${cls}" title="${esc(title)}">
        <input type="checkbox" class="path-check-input" data-seq="${item.seq}" ${checked ? 'checked' : ''}>
        <span class="path-check-lbl">需查路径</span>
    </label>`;
}

function bindBatchEdits(tbody) {
    if (!tbody) return;
    tbody.querySelectorAll('.batch-edit-l2').forEach(sel => {
        sel.addEventListener('change', () => {
            commitBatchFieldEdit(parseInt(sel.dataset.seq, 10), 'categoryL2', sel.value);
        });
    });
    tbody.querySelectorAll('.batch-edit-module').forEach(inp => {
        inp.addEventListener('change', () => {
            commitBatchFieldEdit(parseInt(inp.dataset.seq, 10), 'relatedModule', inp.value.trim());
        });
    });
    tbody.querySelectorAll('.batch-edit-result-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = batchItems.find(i => i.seq === parseInt(btn.dataset.seq, 10));
            if (!item) return;
            item._editingResult = true;
            updateBatchRow(item.seq, {});
        });
    });
    tbody.querySelectorAll('.batch-save-result').forEach(btn => {
        btn.addEventListener('click', () => {
            const seq = parseInt(btn.dataset.seq, 10);
            const ta = tbody.querySelector(`.batch-edit-result[data-seq="${seq}"]`);
            if (ta) commitBatchFieldEdit(seq, 'resultBody', ta.value.trim());
        });
    });
    tbody.querySelectorAll('.batch-cancel-result').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = batchItems.find(i => i.seq === parseInt(btn.dataset.seq, 10));
            if (!item) return;
            item._editingResult = false;
            updateBatchRow(item.seq, {});
        });
    });
}

function bindPathCheckboxes(tbody) {
    tbody.querySelectorAll('.path-check-input').forEach(cb => {
        cb.addEventListener('change', () => {
            const seq = parseInt(cb.dataset.seq, 10);
            const item = batchItems.find(i => i.seq === seq);
            if (!item) return;
            item.needPath = cb.checked;
            const tag = cb.closest('.path-check-tag');
            if (tag) {
                tag.classList.toggle('checked', cb.checked);
                tag.classList.toggle('unchecked', !cb.checked);
            }
            const pid = getCurrentPeriodId();
            const snap = getClassifySnapshot(pid);
            saveClassifySnapshot(pid, snap?.confirmed ? { keepConfirmed: true } : {});
            fillPathNeedPathUserSelect();
        });
    });
}

function hideClassifyBelow() {
    const below = document.getElementById('classifyBelow');
    if (below) below.hidden = true;
    const panel = document.getElementById('batchPanel');
    if (panel) panel.style.display = 'none';
}

function showClassifyBelow() {
    const below = document.getElementById('classifyBelow');
    if (below) below.hidden = false;
}

function renderBatchTable() {
    const panel = document.getElementById('batchPanel');
    const tbody = document.getElementById('batchTableBody');
    const title = document.getElementById('batchPreviewTitle');
    if (!panel || !tbody) return;

    const total = batchItems.length;
    if (total === 0) {
        panel.style.display = 'none';
        return;
    }

    const below = document.getElementById('classifyBelow');
    if (below && below.hidden) return;

    panel.style.display = 'block';
    title.textContent = `\u6570\u636e\u9884\u89c8 \u00b7 \u5171 ${total} \u6761`;
    updateBatchProgress(
        batchItems.filter(i => i.status === 'done').length,
        total
    );

    tbody.innerHTML = batchItems.map(item => {
        const preview = item.message.length > 80 ? item.message.slice(0, 80) + '…' : item.message;
        return `<tr data-seq="${item.seq}">
            <td class="col-num">${item.seq}</td>
            <td class="col-l1">${esc(item.labelL1 || '—')}</td>
            <td class="col-l2-src">${esc(item.labelL2 || '—')}</td>
            <td class="col-msg">
                <div class="msg-preview">${esc(preview)}</div>
                <div class="msg-full">${esc(item.message)}</div>
                ${item.message.length > 80 ? '<button type="button" class="msg-toggle">点击展开/收起</button>' : ''}
            </td>
            <td class="col-member">${membershipTypeCellHtml(item)}</td>
            <td class="col-uid">${userIdCellHtml(item)}</td>
            <td class="col-time">${esc(displayItemTime(item.time))}</td>
            <td class="col-l2-ai">${categoryL2CellHtml(item)}</td>
            <td class="col-module">${relatedModuleCellHtml(item)}</td>
            <td class="col-result">${resultBodyHtml(item)}</td>
            <td class="col-path">${pathCheckHtml(item)}</td>
        </tr>`;
    }).join('');

    bindPathCheckboxes(tbody);
    bindBatchEdits(tbody);
    renderRules();
    updateConfirmClassifyStatus();
    tbody.querySelectorAll('.msg-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('tr').classList.toggle('row-expanded');
            btn.textContent = btn.closest('tr').classList.contains('row-expanded') ? '点击收起' : '点击展开/收起';
        });
    });
}

function updateBatchProgress(done, total) {
    const fill = document.getElementById('batchProgressFill');
    const text = document.getElementById('batchProgressText');
    const ok = batchItems.filter(i => i.status === 'done').length;
    const err = batchItems.filter(i => i.status === 'error').length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    if (fill) fill.style.width = pct + '%';
    if (text) {
        text.textContent = err
            ? `已处理 ${done} / ${total}（成功 ${ok}，失败 ${err}）`
            : `${done} / ${total}`;
    }
}

function updateBatchRow(seq, patch) {
    const item = batchItems.find(i => i.seq === seq);
    if (!item) return;
    Object.assign(item, patch);
    if (patch.status === 'done' && item.result) applyAnalysisResult(item);
    const tr = document.querySelector(`#batchTableBody tr[data-seq="${seq}"]`);
    if (!tr) return;
    const l1Cell = tr.querySelector('.col-l1');
    const l2SrcCell = tr.querySelector('.col-l2-src');
    const memberCell = tr.querySelector('.col-member');
    const uidCell = tr.querySelector('.col-uid');
    const timeCell = tr.querySelector('.col-time');
    const l2Cell = tr.querySelector('.col-l2-ai');
    const moduleCell = tr.querySelector('.col-module');
    const resultCell = tr.querySelector('.col-result');
    const pathCell = tr.querySelector('.col-path');
    if (l1Cell) l1Cell.textContent = item.labelL1 || '—';
    if (l2SrcCell) l2SrcCell.textContent = item.labelL2 || '—';
    if (memberCell) memberCell.innerHTML = membershipTypeCellHtml(item);
    if (uidCell) uidCell.innerHTML = userIdCellHtml(item);
    if (timeCell) timeCell.textContent = displayItemTime(item.time);
    if (l2Cell) l2Cell.innerHTML = categoryL2CellHtml(item);
    if (moduleCell) moduleCell.innerHTML = relatedModuleCellHtml(item);
    if (resultCell) resultCell.innerHTML = resultBodyHtml(item);
    if (pathCell) pathCell.innerHTML = pathCheckHtml(item);
    if (tr.parentElement) {
        bindPathCheckboxes(tr.parentElement);
        bindBatchEdits(tr.parentElement);
    }
}

async function runBatchClassify() {
    if (batchRunning) return;
    if (!batchItems.length) {
        syncBatchFromText();
        if (!batchItems.length) return toast('请先加载或解析反馈数据', 'err');
    }

    try {
        getAPIConfig();
    } catch (e) {
        return toast(e.message, 'err');
    }

    batchAbort = false;
    batchRunning = true;
    const alertEl = document.getElementById('batchAlert');
    if (alertEl) {
        alertEl.hidden = true;
        alertEl.textContent = '';
    }
    const classifyBtn = document.getElementById('classifyBtn');
    const cancelBtn = document.getElementById('cancelClassifyBtn');
    classifyBtn.disabled = true;
    cancelBtn.style.display = '';

    const sysPrompt = buildSystemPrompt('classifySingle');
    const total = batchItems.length;
    let done = 0;

    for (const item of batchItems) {
        if (batchAbort) break;
        if (item.status === 'done' && item.result) {
            done++;
            updateBatchProgress(done, total);
            continue;
        }

        item.status = 'running';
        item.result = '';
        item.resultBody = '';
        item.categoryL2 = '';
        item.relatedModule = '';
        updateBatchRow(item.seq, { status: 'running' });

        const userMsg = `用户ID：${item.userId}\n反馈时间：${item.time}\n原文：${item.message}${item.labelL2 ? '\n（人工标注二级：' + item.labelL2 + '）' : ''}`;

        try {
            item.result = await callAI(userMsg, sysPrompt, 1200);
            item.status = 'done';
            applyAnalysisResult(item);
        } catch (e) {
            item.status = 'error';
            item.result = friendlyApiError(e.message || String(e));
            item.resultBody = '';
            item.categoryL2 = '';
            item.relatedModule = '';
            if (isFatalApiError(e.message)) {
                showBatchAlert(item.result);
                batchAbort = true;
                toast(item.result + '，已停止后续分析', 'err');
            }
        }

        done++;
        updateBatchRow(item.seq, { status: item.status, result: item.result });
        updateBatchProgress(done, total);
        await new Promise(r => setTimeout(r, 200));
    }

    batchRunning = false;
    classifyBtn.disabled = false;
    cancelBtn.style.display = 'none';

    updateBatchAlertSummary();

    if (batchAbort) toast('已停止分析', 'info');
    else {
        const ok = batchItems.filter(i => i.status === 'done').length;
        const fail = batchItems.filter(i => i.status === 'error').length;
        if (fail && !ok) toast(`分析失败 ${fail} 条，请检查「设置」中的 API Key 与余额`, 'err');
        else if (fail) toast(`完成：成功 ${ok} 条，失败 ${fail} 条`, 'info');
        else toast(`分析完成 ${ok} / ${total} 条`, 'ok');
    }
    saveClassifySnapshot(getCurrentPeriodId());
    refreshPathFillUI();
    updateConfirmClassifyStatus();
}

function showBatchAlert(message) {
    const el = document.getElementById('batchAlert');
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
}

function updateBatchAlertSummary() {
    const el = document.getElementById('batchAlert');
    if (!el) return;
    const errors = batchItems.filter(i => i.status === 'error');
    if (!errors.length) {
        el.hidden = true;
        el.textContent = '';
        return;
    }
    const fatal = errors.filter(i => isFatalApiError(i.result));
    if (fatal.length) {
        el.hidden = false;
        el.textContent = friendlyApiError(fatal[0].result) +
            `（${errors.length} 条失败，请打开左侧「设置」检查 API）`;
    } else if (!el.hidden && el.textContent) {
        return;
    } else {
        el.hidden = false;
        el.textContent = `${errors.length} 条分析失败，请在表格中查看详情`;
    }
}

// ==================== 反馈分类 ====================
function initClassify() {
    // 文件上传
    const area = document.getElementById('uploadArea');
    const input = document.getElementById('fileInput');
    if (!area || !input) {
        console.error('initClassify: uploadArea or fileInput missing');
        return;
    }
    const pickBtn = document.getElementById('pickFileBtn');
    const fileNameEl = document.getElementById('uploadFileName');
    const openPicker = () => input.click();
    pickBtn?.addEventListener('click', e => { e.stopPropagation(); openPicker(); });
    area.addEventListener('click', e => {
        if (e.target.closest('#pickFileBtn')) return;
        openPicker();
    });
    area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', e => {
        e.preventDefault(); area.classList.remove('dragover');
        if (e.dataTransfer.files[0]) {
            if (fileNameEl) {
                fileNameEl.textContent = e.dataTransfer.files[0].name;
                fileNameEl.hidden = false;
            }
            readFile(e.dataTransfer.files[0], 'feedbackInput');
        }
    });
    input.addEventListener('change', () => {
        if (!input.files[0]) return;
        if (fileNameEl) {
            fileNameEl.textContent = input.files[0].name;
            fileNameEl.hidden = false;
        }
        readFile(input.files[0], 'feedbackInput');
    });

    document.getElementById('loadWeekFeedbackBtn')?.addEventListener('click', loadWeekFeedback);
    document.getElementById('editDocBtn')?.addEventListener('click', () => {
        showClassifyBelow();
        if (batchItems.length) {
            renderBatchTable();
            toast(`已展开预览，共 ${batchItems.length} 条`, 'ok');
            return;
        }
        syncBatchFromText();
        if (batchItems.length) {
            renderBatchTable();
            toast(`已展开预览，共 ${batchItems.length} 条`, 'ok');
        } else {
            toast('请先点击上方「加载测试文件」，或上传 xlsx/csv', 'err');
        }
    });
    hideClassifyBelow();

    document.getElementById('feedbackInput').addEventListener('input', () => {
        const t = document.getElementById('feedbackInput').value;
        if (feedbackRowsCache) {
            const cacheText = feedbackRowsToAiText(feedbackRowsCache).trim();
            if (t.trim() !== cacheText) feedbackRowsCache = null;
        }
        if (isSpreadsheetGarbage(t)) {
            document.getElementById('feedbackCount').textContent = '格式错误';
            return;
        }
        document.getElementById('feedbackCount').textContent = countFeedbackLines(t) + ' 条';
    });

    document.getElementById('classifyBtn')?.addEventListener('click', runBatchClassify);
    document.getElementById('cancelClassifyBtn')?.addEventListener('click', () => {
        batchAbort = true;
    });
    document.getElementById('confirmClassifyBtn')?.addEventListener('click', confirmClassify);
    updateConfirmClassifyStatus();
}

// ==================== 路径分析 ====================
function initPath() {
    updatePathLocalModeUI();
    document.getElementById('pathPeriod')?.addEventListener('change', function () {
        if (this.value) onPathPeriodChange(this.value);
        else fillPathNeedPathUserSelect();
    });

    document.querySelectorAll('input[name="pathFillMode"]').forEach(radio => {
        radio.addEventListener('change', updatePathFillModeUI);
    });
    updatePathFillModeUI();

    document.getElementById('pathNeedPathUser')?.addEventListener('change', function () {
        if (this.value) applyPathNeedPathUserSelection(this.value);
    });

    const pathUidEl = document.getElementById('pathUid');
    pathUidEl?.addEventListener('input', function () {
        const v = this.value.trim();
        if (/^\d{5,}$/.test(v)) scheduleLoadUserPathById(v);
    });
    pathUidEl?.addEventListener('blur', function () {
        const v = this.value.trim();
        if (v) loadUserPathById(v, { silent: false });
    });

    document.getElementById('logFileInput')?.addEventListener('change', function () {
        if (this.files[0]) readFile(this.files[0], 'pathLog');
    });

    document.getElementById('pathPickLogDirBtn')?.addEventListener('click', async () => {
        const ok = await pickBehaviorLogDirectory();
        if (ok) {
            const uid = getActivePathUserId();
            if (uid) await loadUserPathById(uid, { silent: false });
        }
    });

    document.getElementById('pathTime')?.addEventListener('change', function () {
        const n = normalizeFeedbackTime(this.value);
        if (n && n !== this.value) this.value = n;
        const uid = getActivePathUserId();
        if (uid) loadUserPathById(uid, { silent: false });
    });
    document.getElementById('pathTime')?.addEventListener('blur', function () {
        const n = normalizeFeedbackTime(this.value);
        if (n && n !== this.value) this.value = n;
    });

    document.getElementById('pathSaveBtn')?.addEventListener('click', savePendingPathToReport);

    document.getElementById('pathBtn').addEventListener('click', async () => {
        let uid = getActivePathUserId();
        let time = document.getElementById('pathTime').value.trim();
        const fb = document.getElementById('pathFeedback').value.trim();
        let log = (pathLogStore || document.getElementById('pathLog').value).trim();

        if (!uid) return toast('请选择或填写用户 ID', 'err');

        const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
        const batchItem = getClassifyItemForUser(periodId, uid);
        if (!time) {
            time = applyPathUserFields(uid, weekIndex?.users?.find(x => String(x.user_id) === uid), batchItem);
        }
        time = normalizeFeedbackTime(time) || time;
        if (!time || isExcelSerialString(time)) {
            return toast('反馈时间格式有误，请改为 yyyy-MM-dd HH:mm:ss', 'err');
        }

        if (!log) {
            showLoading('加载用户行为日志...');
            try {
                await loadUserPathById(uid, { silent: true });
                log = (pathLogStore || document.getElementById('pathLog').value).trim();
            } finally {
                hideLoading();
            }
        }
        if (!log) return toast('请先加载该用户的行为日志', 'err');

        showLoading('AI 正在分析用户行为路径...');
        try {
            const userMsg = `用户ID：${uid}\n反馈原文：${fb}\n反馈时间：${time}\n（行为日志为反馈时刻及前 ${PATH_LOG_WINDOW_MINUTES} 分钟内记录）\n\n用户行为日志：\n${log}`;
            const result = await callAI(userMsg, buildSystemPrompt('path'));
            showResultPanel('pathResult', 'pathBody', result);
            const periodId = document.getElementById('pathPeriod')?.value || getCurrentPeriodId();
            const batchItem = getClassifyItemForUser(periodId, uid);
            pendingPathDraft = {
                periodId,
                userId: uid,
                seq: batchItem?.seq,
                feedback: fb,
                feedbackTime: time,
                result,
                saved: false
            };
            updatePathSaveButtonState();
            toast('路径分析完成，请确认后点击「保存至汇总报告」', 'ok');
        } catch (e) {
            toast('分析失败: ' + e.message, 'err');
        } finally {
            hideLoading();
        }
    });
}

// ==================== 汇总报告 ====================
function initReport() {
    document.getElementById('reportPeriod')?.addEventListener('change', function () {
        if (this.value) loadReportPeriodData(this.value);
    });
    document.getElementById('reportReloadBtn')?.addEventListener('click', () => {
        const pid = document.getElementById('reportPeriod')?.value;
        if (!pid) return toast('请先选择反馈周期', 'err');
        loadReportPeriodData(pid);
        toast('已刷新该周期材料', 'ok');
    });

    document.getElementById('reportBtn')?.addEventListener('click', async () => {
        const periodId = document.getElementById('reportPeriod')?.value || getCurrentPeriodId();
        const classified = document.getElementById('reportClassified').value.trim();
        if (!classified) return toast('请选择周期并载入分类结论，或手动填写反馈材料', 'err');
        const pathFromStories = buildPathStoriesReportText(periodId, true);
        const pathExtra = document.getElementById('reportPaths')?.value.trim() || '';
        const paths = [pathFromStories, pathExtra].filter(Boolean).join('\n\n') || '暂无';

        showLoading('AI 正在生成汇总报告...');
        try {
            const period = getPeriodById(periodId);
            const periodLabel = period?.labelFull || period?.label || periodId;
            const userMsg = `## 反馈周期\n${periodLabel}\n\n## 已分类的反馈数据\n${classified}\n\n## 用户路径分析结果（典型用户故事）\n${paths}`;
            const result = await callAI(userMsg, buildSystemPrompt('report'));
            saveReportResult(periodId, result);
            showResultPanel('reportResult', 'reportBody', result);
            toast('周报生成完成', 'ok');
        } catch (e) {
            toast('生成失败: ' + e.message, 'err');
        } finally {
            hideLoading();
        }
    });
}

// ==================== 规则与修订渲染 ====================
// ==================== 规则与修订渲染 ====================
function renderRules() {
    const rules = JSON.parse(localStorage.getItem('cz_rules') || '[]');
    const revisions = JSON.parse(localStorage.getItem('cz_revisions') || '[]');

    const rulesCount = document.getElementById('rulesCount');
    if (rulesCount) rulesCount.textContent = rules.length;
    const batchRulesCount = document.getElementById('batchRulesCount');
    if (batchRulesCount) batchRulesCount.textContent = rules.length;
    const batchRevCount = document.getElementById('batchRevCount');
    if (batchRevCount) batchRevCount.textContent = revisions.length;

    const rulesHtml = rules.length === 0
        ? '<p class="empty">暂无规则，在表格中修订分类后会自动记录</p>'
        : rules.map((r, i) =>
            `<div class="rule-item"><span class="rule-num">${i + 1}</span><span class="rule-txt">${esc(r.rule)}</span></div>`
        ).join('');

    const revHtml = revisions.length === 0
        ? '<p class="empty">暂无修订记录</p>'
        : revisions.slice().reverse().slice(0, 30).map(r =>
            `<div class="rev-item">
                <div class="rev-badges">
                    <strong>#${esc(r.feedback_id)}</strong>
                    <span class="badge badge-from">${esc(r.original_category)}</span>
                    <span style="color:var(--g400)">→</span>
                    <span class="badge badge-to">${esc(r.revised_category)}</span>
                </div>
                <div style="font-size:12px;">${esc(r.reason)}</div>
                ${r.learned_rule ? `<div style="font-size:11px;color:var(--b7);margin-top:4px;">🧠 ${esc(r.learned_rule)}</div>` : ''}
                <div class="rev-meta">${r.timestamp || ''}</div>
            </div>`
        ).join('');

    ['batchRulesList', 'rulesList'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = rulesHtml;
    });
    ['batchRevisionList', 'revisionList'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = revHtml;
    });
}

function getLearnedRulesText() {
    const rules = JSON.parse(localStorage.getItem('cz_rules') || '[]');
    if (rules.length === 0) return '（暂无修订规则，使用默认逻辑）';
    return '以下是从历次修订中学到的规则，请遵循：\n' +
        rules.map((r, i) => `${i + 1}. ${r.rule}`).join('\n');
}

const LS_PRODUCT_EXTRA = 'cz_product_knowledge_extra';
const LS_PRODUCT_SYNC = 'cz_product_knowledge_sync_draft';

function getProductKnowledgeExtraText() {
    const extra = (localStorage.getItem(LS_PRODUCT_EXTRA) || '').trim();
    if (!extra) return '';
    return `\n## 产品知识动态补充（运营同步）\n${extra}\n`;
}

function buildSystemPrompt(templateKey) {
    let prompt = SYSTEM_PROMPTS[templateKey] || '';
    prompt = prompt.replace(/\{learned_rules\}/g, getLearnedRulesText());
    prompt = prompt.replace(/\{product_knowledge_extra\}/g, getProductKnowledgeExtraText());
    return prompt;
}

function loadProductKnowledgeUI() {
    const extraEl = document.getElementById('productKnowledgeExtra');
    const syncEl = document.getElementById('productSyncInput');
    if (extraEl) extraEl.value = localStorage.getItem(LS_PRODUCT_EXTRA) || '';
    if (syncEl) syncEl.value = localStorage.getItem(LS_PRODUCT_SYNC) || '';
}

function saveProductKnowledgeExtra(notify) {
    const extraEl = document.getElementById('productKnowledgeExtra');
    if (!extraEl) return;
    localStorage.setItem(LS_PRODUCT_EXTRA, extraEl.value.trim());
    const st = document.getElementById('productKnowledgeStatus');
    if (st) st.textContent = '已保存 · ' + new Date().toLocaleString('zh-CN');
    if (notify) toast('动态补充知识已保存', 'ok');
}

async function runProductKnowledgeAi() {
    const syncNotes = document.getElementById('productSyncInput')?.value.trim();
    if (!syncNotes) return toast('请先填写本期产品变更说明', 'err');
    try {
        getAPIConfig();
    } catch (e) {
        return toast(e.message, 'err');
    }
    const current = localStorage.getItem(LS_PRODUCT_EXTRA) || '（暂无，首次将根据本期说明新建）';
    const sys = SYSTEM_PROMPTS.knowledgeUpdate
        .replace('{current_extra}', current)
        .replace('{sync_notes}', syncNotes);
    showLoading('AI 正在整理产品知识…');
    try {
        const result = await callAI('请输出更新后的动态补充知识。', sys, 2500);
        const extraEl = document.getElementById('productKnowledgeExtra');
        if (extraEl) extraEl.value = result.trim();
        localStorage.setItem(LS_PRODUCT_SYNC, syncNotes);
        saveProductKnowledgeExtra(false);
        document.getElementById('productKnowledgeStatus').textContent =
            'AI 已更新 · ' + new Date().toLocaleString('zh-CN');
        toast('产品知识已补充，后续分析将自动引用', 'ok');
    } catch (e) {
        toast(friendlyApiError(e.message || String(e)), 'err');
    } finally {
        hideLoading();
    }
}

function initKnowledge() {
    loadProductKnowledgeUI();
    document.getElementById('productKnowledgeAiBtn')?.addEventListener('click', runProductKnowledgeAi);
    document.getElementById('productKnowledgeSaveBtn')?.addEventListener('click', () => {
        const syncEl = document.getElementById('productSyncInput');
        if (syncEl) localStorage.setItem(LS_PRODUCT_SYNC, syncEl.value);
        saveProductKnowledgeExtra(true);
    });
    document.getElementById('productSyncInput')?.addEventListener('input', function () {
        localStorage.setItem(LS_PRODUCT_SYNC, this.value);
    });
}

// ==================== 通用工具 ====================

function countFeedbackLines(text) {
    const numbered = (text.match(/^\d+\.\s+用户ID:/gm) || []).length;
    return numbered || (text.trim() ? text.split('\n').filter(l => l.trim()).length : 0);
}

function setFeedbackText(text) {
    const ta = document.getElementById('feedbackInput');
    ta.value = text;
    ta.dispatchEvent(new Event('input'));
    syncBatchFromText();
    if (batchItems.length) showClassifyBelow();
}

function cleanFeedbackMsg(text) {
    return String(text || '').replace(/^\[图片\]\s*/i, '').replace(/\s+/g, ' ').trim();
}

function feedbackRowsToAiText(rows) {
    const lines = [];
    let fallbackSeq = 0;
    for (const row of rows) {
        const norm = normalizeRowKeys(row);
        const uid = pickField(norm, '用户ID', 'user_id', 'userid');
        const msg = cleanFeedbackMsg(pickField(norm, '有效信息', '反馈内容', '留言', 'feedback_text', 'content'));
        if (!msg) continue;
        const rowSeqRaw = pickField(norm, 'seq', '序号');
        const seq = rowSeqRaw ? parseInt(rowSeqRaw, 10) : (++fallbackSeq);
        const time = pickTimeFromRow(norm) || '2026-03-11 12:00:00';
        const mem = pickField(norm, 'membership', '用户身份', '会员身份', '会员类型');
        const memPart = mem ? `会员身份: ${mem}, ` : '';
        const label = pickLabelL2(norm);
        const hint = label ? `（人工标注二级: ${label}）` : '';
        lines.push(`${seq}. 用户ID: ${uid || '未知'}, ${memPart}时间: ${time}, 留言: "${msg}"${hint}`);
    }
    return lines.join('\n');
}

function feedbackCsvToAiText(csv) {
    if (typeof XLSX === 'undefined') throw new Error('表格解析库未加载');
    const wb = XLSX.read(csv, { type: 'string' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = sheetToJsonRows(sheet);
    return feedbackRowsToAiText(rows);
}

function parseSpreadsheetBuffer(buf) {
    if (typeof XLSX === 'undefined') {
        throw new Error('Excel 解析库未加载，请刷新页面或检查网络');
    }
    const wb = XLSX.read(buf, { type: 'array', cellDates: true });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return sheetToJsonRows(sheet);
}

async function parseSpreadsheetFile(file) {
    return parseSpreadsheetBuffer(await file.arrayBuffer());
}

function getTestFeedbackXlsxUrl(periodId) {
    const period = getPeriodById(periodId || getCurrentPeriodId());
    return period?.feedbackXlsx || WEEK_DATA.testFeedbackXlsx;
}

async function fetchTestFeedbackRows() {
    if (typeof XLSX === 'undefined') {
        throw new Error('表格解析库未加载，请检查网络后刷新页面（需加载 SheetJS）');
    }
    const url = getTestFeedbackXlsxUrl();
    const res = await fetch(url + '?_=' + Date.now());
    if (!res.ok) {
        console.warn('fetch test xlsx failed', url, res.status);
        return null;
    }
    return parseSpreadsheetBuffer(await res.arrayBuffer());
}

function pickTestFixtureFile() {
    return new Promise(resolve => {
        let input = document.getElementById('testFixtureFileInput');
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = 'testFixtureFileInput';
            input.accept = '.xlsx,.xls';
            input.hidden = true;
            document.body.appendChild(input);
            input.addEventListener('change', async () => {
                const file = input.files?.[0];
                input.value = '';
                if (!file) {
                    resolve(null);
                    return;
                }
                try {
                    const rows = await parseSpreadsheetFile(file);
                    resolve(rows?.length ? rows : null);
                } catch (e) {
                    toast(e.message, 'err');
                    resolve(null);
                }
            });
        }
        toast('请选择 data/test/week_2026_w10_online_feedback.xlsx', 'info');
        input.click();
    });
}

function applyFeedbackRowsToUI(rows, periodId) {
    feedbackRowsCache = rows;
    batchItems = feedbackItemsFromRows(rows);
    document.getElementById('feedbackInput').value = feedbackRowsToAiText(rows);
    currentPeriodId = periodId || 'week_2026_w10';
    localStorage.setItem(LS_CURRENT_PERIOD, currentPeriodId);
    showClassifyBelow();
    renderBatchTable();
    refreshPathFillUI();
    refreshReportPeriodSelect();
}

async function readFile(file, targetId) {
    const name = (file.name || '').toLowerCase();
    const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls');
    const isFeedback = targetId === 'feedbackInput';

    if (isExcel && !isFeedback) {
        toast('行为日志 xlsx 过大，请用「第10周用户」下拉加载，或上传已导出的 CSV', 'err');
        return;
    }

    try {
        if (isExcel || (isFeedback && name.endsWith('.csv'))) {
            const rows = isExcel
                ? await parseSpreadsheetFile(file)
                : await (async () => {
                    const text = await file.text();
                    if (isSpreadsheetGarbage(text)) {
                        throw new Error('文件已损坏或不是文本 CSV，请上传 .xlsx 或运行 prepare 脚本生成的 CSV');
                    }
                    if (typeof XLSX === 'undefined') return null;
                    const wb = XLSX.read(text, { type: 'string', cellDates: true });
                    const sheet = wb.Sheets[wb.SheetNames[0]];
                    return sheetToJsonRows(sheet);
                })();

            if (isFeedback && rows) {
                const text = feedbackRowsToAiText(rows);
                if (!text) throw new Error('未解析到有效反馈，请确认表头含「有效信息」「用户ID」「反馈时间」等列');
                feedbackRowsCache = rows;
                batchItems = feedbackItemsFromRows(rows);
                document.getElementById('feedbackInput').value = text;
                document.getElementById('feedbackInput').dispatchEvent(new Event('input'));
                hideClassifyBelow();
                refreshPathFillUI();
                toast(`已解析 ${file.name}：${batchItems.length} 条，点击「编辑文档」可预览`, 'ok');
                return;
            }
        }

        const text = await file.text();
        if (isSpreadsheetGarbage(text)) {
            throw new Error('这是 Excel 二进制内容，请勿用记事本打开。请直接上传 .xlsx 文件');
        }

        if (targetId === 'pathLog') {
            masterLogCsvText = text;
            const uid = document.getElementById('pathUid')?.value.trim();
            const lineCount = text.split(/\r?\n/).length;
            if (uid) {
                const { text: filtered, rows } = filterCsvLinesForUser(text, uid);
                if (rows > 0) {
                    setPathLogContent(filtered, rows);
                    toast(`已从 ${file.name} 筛选用户 ${uid} 的 ${rows} 条日志`, 'ok');
                } else {
                    setPathLogContent('', 0);
                    toast(`文件中未找到用户 ${uid} 的记录`, 'err');
                }
            } else if (text.length > 800000 || lineCount > 8000) {
                toast('文件较大，请先填写「用户 ID」再上传，将自动筛选该用户日志', 'err');
            } else {
                setPathLogContent(text, lineCount - 1);
                toast(`已加载 ${file.name}（${lineCount - 1} 条），填写用户 ID 可重新筛选`, 'ok');
            }
            return;
        }

        document.getElementById(targetId).value = text;
        document.getElementById(targetId).dispatchEvent(new Event('input'));
        toast('已加载: ' + file.name, 'ok');
    } catch (e) {
        toast(e.message, 'err');
    }
}

function showResultPanel(sectionId, bodyId, markdown) {
    const bodyEl = document.getElementById(bodyId);
    let html = renderMd(markdown);
    if (sectionId === 'pathResult') {
        html = transformPathWideTables(html);
    } else if (sectionId === 'reportResult') {
        html = enhanceReportMarkdown(html);
    }
    bodyEl.innerHTML = html;
    const el = document.getElementById(sectionId);
    el.classList.add('show');
    const ph = el.querySelector('.result-placeholder');
    if (ph) ph.hidden = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** 路径分析：宽表转步骤卡片，避免侧栏 7 列表格不可读 */
function transformPathWideTables(html) {
    if (!html) return html;
    const doc = new DOMParser().parseFromString(`<div id="path-md-root">${html}</div>`, 'text/html');
    const root = doc.getElementById('path-md-root');
    if (!root) return html;

    root.querySelectorAll('table').forEach(table => {
        const headerCells = table.querySelectorAll('thead th');
        let headers = [...headerCells].map(th => th.textContent.trim()).filter(Boolean);
        if (!headers.length) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                headers = [...firstRow.querySelectorAll('th, td')].map(c => c.textContent.trim()).filter(Boolean);
            }
        }
        const bodyRows = table.querySelectorAll('tbody tr');
        const rows = bodyRows.length ? [...bodyRows] : [...table.querySelectorAll('tr')].slice(headers.length ? 1 : 0);

        if (headers.length >= 5 && rows.length) {
            const cards = doc.createElement('div');
            cards.className = 'path-step-cards';
            rows.forEach((tr, idx) => {
                const cells = [...tr.querySelectorAll('td, th')].map(c => c.innerHTML.trim() || '—');
                const headText = cells[0] || `步骤 ${idx + 1}`;
                const card = doc.createElement('article');
                card.className = 'path-step-card';
                const fields = headers.slice(1).map((label, i) => {
                    const val = cells[i + 1] || '—';
                    const plainLen = tr.querySelectorAll('td, th')[i + 1]?.textContent?.trim().length || 0;
                    const isLong = /定位|发现|结论|说明|分析/.test(label) || plainLen > 72;
                    return `<div class="path-step-field${isLong ? ' is-long' : ''}"><dt>${esc(label)}</dt><dd>${val}</dd></div>`;
                }).join('');
                card.innerHTML = `
                    <header class="path-step-card-head">
                        <span class="path-step-time">${headText}</span>
                    </header>
                    <dl class="path-step-dl">${fields}</dl>`;
                cards.appendChild(card);
            });
            table.replaceWith(cards);
            return;
        }

        if (headers.length >= 3) {
            const wrap = doc.createElement('div');
            wrap.className = 'md-table-scroll';
            table.classList.add('path-md-table-compact');
            table.parentNode?.insertBefore(wrap, table);
            wrap.appendChild(table);
        }
    });

    return root.innerHTML;
}

/** 汇总周报：表格横向滚动、段落可读性优化 */
function enhanceReportMarkdown(html) {
    if (!html) return html;
    const doc = new DOMParser().parseFromString(
        '<div id="report-md-root">' + html + '</div>',
        'text/html'
    );
    const root = doc.getElementById('report-md-root');
    if (!root) return html;

    root.querySelectorAll('table').forEach(table => {
        table.classList.add('report-md-table');
        const wrap = doc.createElement('div');
        wrap.className = 'md-table-scroll';
        table.parentNode?.insertBefore(wrap, table);
        wrap.appendChild(table);
    });

    return root.innerHTML;
}

function renderMd(text) {
    if (!text) return '';
    let h = esc(text);

    // 代码块
    h = h.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // 表格
    h = h.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (m, hdr, sep, body) => {
        const ths = hdr.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
        const trs = body.trim().split('\n').map(row => {
            const tds = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${tds}</tr>`;
        }).join('');
        return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    });

    // 标题
    h = h.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // 粗体斜体
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 行内代码
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 引用
    h = h.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // 列表
    h = h.replace(/^- (.+)$/gm, '<li>$1</li>');
    h = h.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    // 去重嵌套
    h = h.replace(/<\/ul>\s*<ul>/g, '');

    // 有序列表
    h = h.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // 分隔线
    h = h.replace(/^---$/gm, '<hr>');

    // 段落
    h = h.replace(/\n\n/g, '</p><p>');
    h = '<p>' + h + '</p>';

    // 清理
    h = h.replace(/<p>\s*<(h[1-4]|ul|ol|table|pre|blockquote|hr)/g, '<$1');
    h = h.replace(/<\/(h[1-4]|ul|ol|table|pre|blockquote)>\s*<\/p>/g, '</$1>');
    h = h.replace(/<p>\s*<\/p>/g, '');

    return h;
}

function copyMd(bodyId) {
    const el = document.getElementById(bodyId);
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).then(() => toast('已复制', 'ok')).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta); toast('已复制', 'ok');
    });
}

function dlMd(bodyId, prefix) {
    const el = document.getElementById(bodyId);
    const text = el.innerText || el.textContent;
    const ts = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const name = `${prefix}_${ts}.md`;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    toast('已下载: ' + name, 'ok');
}

function showLoading(text) {
    document.getElementById('loadingText').textContent = text || 'AI 分析中...';
    document.getElementById('loading').classList.add('show');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

function toast(msg, type) {
    const box = document.getElementById('toastBox');
    const el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'info');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0'; el.style.transform = 'translateX(100%)';
        el.style.transition = '.3s';
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

function esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
