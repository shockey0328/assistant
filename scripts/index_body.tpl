<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="sidebar" aria-label="{{nav_aria}}">
    <div class="sidebar-brand">
        <div class="sidebar-brand-top">
            <img class="sidebar-logo" src="assets/xiaochengzi.png" width="64" height="92" alt="{{logo_alt}}">
            <div>
                <h1>{{brand}}</h1>
                <p>{{tagline}}</p>
            </div>
        </div>
    </div>
    <p class="sidebar-workflow">{{workflow_label}}</p>
    <ul class="nav nav-primary">
        <li class="active" data-tab="classify"><span class="nav-label">{{s02}}</span></li>
        <li data-tab="path"><span class="nav-label">{{s03}}</span></li>
        <li data-tab="report"><span class="nav-label">{{s04}}</span></li>
    </ul>
    <div class="nav-settings">
        <button type="button" class="nav-settings-btn" data-tab="settings" aria-label="{{nav_settings}}">
            <span class="nav-settings-icon" aria-hidden="true">&#9881;</span>
            <span class="nav-label">{{nav_settings}}</span>
        </button>
    </div>
    <div class="sidebar-ft">
        <span class="pill">{{rules_ft}} <b id="rulesCount">0</b> {{rules_unit}}</span>
    </div>
</nav>

<main class="main">

    <section class="panel panel-classify active" id="tab-classify" aria-labelledby="classify-title">
        <div class="page-stack">
        <header class="page-header page-header-stack">
            <h2 class="page-title" id="classify-title">{{classify_title}}</h2>
            <p class="page-desc">{{classify_desc}}</p>
            <p class="page-hint-banner" role="note">{{classify_goal}}</p>
        </header>
        <div class="module-section">
            <div class="section-head section-head-with-actions">
                <h3 class="section-title">{{section_import}}</h3>
                <div class="section-head-actions">
                    <button type="button" class="btn btn-s btn-p" id="loadWeekFeedbackBtn">{{btn_week}}</button>
                </div>
            </div>
        <div class="card card-import module-card">
            <div class="import-grid">
                <div class="import-col-upload">
                    <div class="card-head import-col-head">
                        <p class="import-col-caption">{{import_upload_caption}}</p>
                    </div>
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon" aria-hidden="true">&#128193;</div>
                        <p>{{upload_p}} <label for="fileInput">{{upload_link}}</label></p>
                        <input type="file" id="fileInput" accept=".csv,.txt,.xlsx,.xls" hidden>
                        <p class="upload-hint">{{upload_hint}}</p>
                    </div>
                </div>
                <div class="import-col-text">
                    <div class="card-head import-col-head">
                        <p class="import-col-caption">{{import_text_caption}}</p>
                        <button type="button" class="btn btn-s" id="editDocBtn">{{btn_edit_doc}}</button>
                    </div>
                    <textarea id="feedbackInput" rows="14" placeholder="{{fb_placeholder}}"></textarea>
                    <div id="classifyBelow" class="card-foot classify-below" hidden>
                        <span class="count" id="feedbackCount">0 {{count_unit}}</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div class="module-section module-section-table">
            <div class="section-head">
                <h3 class="section-title">{{section_analyze}}</h3>
            </div>
        <div class="card batch-card module-card" id="batchPanel" style="display:none;">
            <div class="batch-toolbar">
                <h3 class="batch-title" id="batchPreviewTitle">{{batch_title}} {{batch_mid}} 0 {{batch_end}}</h3>
                <div class="batch-actions">
                    <button type="button" class="btn btn-s" id="clearClassifyBtn" title="清空本周期 AI 分析结果，便于重新生成">{{btn_clear_classify}}</button>
                    <button type="button" class="btn btn-s" id="cancelClassifyBtn" style="display:none;">{{btn_cancel}}</button>
                    <button type="button" class="btn btn-batch" id="classifyBtn">{{btn_classify}}</button>
                </div>
            </div>
            <div class="batch-progress-wrap">
                <div class="batch-progress-track"><div class="batch-progress-fill" id="batchProgressFill"></div></div>
                <span class="batch-progress-text" id="batchProgressText">0 / 0</span>
            </div>
            <div class="batch-table-wrap">
                <table class="batch-table batch-table-feedback">
                    <thead>
                        <tr>
                            <th class="col-num">{{th_num}}</th>
                            <th class="col-l1">{{th_l1}}</th>
                            <th class="col-l2-src">{{th_l2_src}}</th>
                            <th class="col-msg">{{th_msg}}</th>
                            <th class="col-member">{{th_member}}</th>
                            <th class="col-uid">{{th_user_id}}</th>
                            <th class="col-time">{{th_time}}</th>
                            <th class="col-l2-ai col-analysis">{{th_l2_ai}}</th>
                            <th class="col-module col-analysis">{{th_module}}</th>
                            <th class="col-result col-analysis">{{th_detail}}</th>
                            <th class="col-path col-analysis">{{th_path}}</th>
                        </tr>
                    </thead>
                    <tbody id="batchTableBody"></tbody>
                </table>
            </div>
            <details class="batch-learned-panel" id="batchLearnedPanel">
                <summary>{{batch_rules_summary}} <b id="batchRulesCount">0</b> {{rules_unit}} · {{batch_rev_summary}} <b id="batchRevCount">0</b> {{batch_rev_unit}}</summary>
                <div class="batch-learned-body">
                    <div class="batch-learned-col">
                        <h4 class="batch-learned-h4">{{rules_h3}}</h4>
                        <div id="batchRulesList"><p class="empty">{{rules_empty}}</p></div>
                    </div>
                    <div class="batch-learned-col">
                        <h4 class="batch-learned-h4">{{rev_hist}}</h4>
                        <div id="batchRevisionList"><p class="empty">{{rev_empty}}</p></div>
                    </div>
                </div>
            </details>
            <div class="card-foot batch-confirm-foot">
                <p class="classify-confirm-status" id="classifyConfirmStatus">{{classify_confirm_hint}}</p>
                <button type="button" class="btn btn-p" id="confirmClassifyBtn" disabled>{{btn_confirm_classify}}</button>
            </div>
        </div>
        </div>
        </div>
    </section>

    <section class="panel" id="tab-settings" aria-labelledby="settings-hub-title">
        <div class="page-stack">
        <header class="page-header page-header-stack page-header-compact">
            <h2 class="page-title" id="settings-hub-title">{{settings_hub_title}}</h2>
            <p class="page-hint-banner page-hint-banner-muted" role="note">{{settings_goal}}</p>
        </header>
        <div class="settings-tabs" role="tablist">
            <button type="button" class="settings-tab active" role="tab" data-settings-pane="api" aria-selected="true">{{s01}}</button>
            <button type="button" class="settings-tab" role="tab" data-settings-pane="knowledge">{{s06}}</button>
        </div>
        <div class="settings-period-bar card module-card">
            <div class="settings-period-bar-text">
                <span class="settings-period-bar-label">{{settings_data_title}}</span>
                <strong class="settings-period-bar-value" id="settingsPeriodLabel">—</strong>
                <p class="settings-period-bar-hint">{{settings_data_desc}}</p>
            </div>
            <button type="button" class="btn btn-s" id="clearPeriodAllBtn" title="{{settings_clear_all_title}}">{{btn_clear_period_all}}</button>
        </div>
        <div id="settings-pane-api" class="settings-pane active" role="tabpanel">
            <p class="settings-pane-desc">{{settings_desc}}</p>
            <div class="settings-layout">
                <div class="settings-layout-main">
                    <div class="card module-card">
                        <div class="card-head">
                            <h3 class="card-head-title">{{conn_title}}</h3>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label for="aiProvider">{{lbl_provider}}</label>
                                <select id="aiProvider">
                                    <option value="openai">OpenAI</option>
                                    <option value="deepseek">DeepSeek</option>
                                    <option value="zhipu">{{opt_zhipu}}</option>
                                    <option value="custom">{{opt_custom}}</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label for="aiModel">{{lbl_model}}</label>
                                <input type="text" id="aiModel" value="gpt-4o" placeholder="gpt-4o / deepseek-chat / glm-4-flash">
                            </div>
                        </div>
                        <div class="form-row full">
                            <div class="form-field">
                                <label for="apiKey">{{lbl_key}} <span class="label-hint">{{hint_key}}</span></label>
                                <input type="password" id="apiKey" placeholder="sk-..." autocomplete="off">
                            </div>
                        </div>
                        <div class="form-row full" id="customBaseRow" style="display:none;">
                            <div class="form-field">
                                <label for="customBase">{{lbl_base}}</label>
                                <input type="text" id="customBase" placeholder="https://api.aimindsky.com/v1">
                            </div>
                        </div>
                        <div class="card-foot">
                            <span class="status-text" id="settingsStatus"></span>
                            <div class="btn-group">
                                <button type="button" class="btn btn-s" id="testApiBtn">{{btn_test}}</button>
                                <button type="button" class="btn btn-p" id="saveSettingsBtn">{{btn_save}}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <aside class="settings-layout-aside" aria-label="{{guide_title}}">
                    <div class="card module-card settings-guide-card">
                        <div class="card-head">
                            <h3 class="card-head-title">{{guide_title}}</h3>
                        </div>
                        <div class="tip-list tip-list-compact">
                            <p><strong>OpenAI</strong> &mdash; {{guide1d}}</p>
                            <p><strong>DeepSeek</strong> &mdash; {{guide2d}}</p>
                            <p><strong>{{guide_zhipu_label}}</strong> &mdash; {{guide_zhipu_d}}</p>
                            <p><strong>{{guide3_label}}</strong> &mdash; {{guide3d}}</p>
                        </div>
                        <div class="alert alert-warn">{{warn_key}}</div>
                    </div>
                </aside>
            </div>
        </div>

        <div id="settings-pane-knowledge" class="settings-pane" role="tabpanel">
            <p class="settings-pane-desc">{{know_desc}}</p>
            <section class="settings-know-ops" aria-labelledby="know-ops-title">
                <div class="section-head">
                    <span class="section-num">01</span>
                    <h3 class="section-title" id="know-ops-title">{{know_ai_title}}</h3>
                </div>
                <div class="card card-know-ai module-card">
                    <p class="know-ai-desc">{{know_ai_desc}}</p>
                    <div class="know-editor-grid">
                        <div class="form-field know-editor-input">
                            <label for="productSyncInput">{{know_ai_sync_lbl}}</label>
                            <textarea id="productSyncInput" rows="10" placeholder="{{know_ai_sync_ph}}"></textarea>
                        </div>
                        <div class="form-field know-editor-output">
                            <label for="productKnowledgeExtra">{{know_ai_extra_lbl}} <span class="label-hint">{{know_ai_extra_hint}}</span></label>
                            <textarea id="productKnowledgeExtra" rows="10" placeholder="{{know_ai_extra_ph}}"></textarea>
                        </div>
                    </div>
                    <div class="card-foot">
                        <span class="status-text" id="productKnowledgeStatus"></span>
                        <div class="btn-group">
                            <button type="button" class="btn btn-s" id="productKnowledgeSaveBtn">{{know_ai_save}}</button>
                            <button type="button" class="btn btn-p" id="productKnowledgeAiBtn">{{know_ai_btn}}</button>
                        </div>
                    </div>
                </div>
            </section>
            <section class="settings-know-ref" aria-labelledby="know-ref-title">
                <div class="section-head">
                    <span class="section-num">02</span>
                    <h3 class="section-title" id="know-ref-title">{{know_ref_title}}</h3>
                    <p class="section-head-hint">{{know_ref_hint}}</p>
                </div>
{{knowledge}}
            </section>
        </div>
        </div>
    </section>

    <section class="panel" id="tab-path" aria-labelledby="path-title">
        <div class="page-stack">
        <header class="page-header page-header-stack">
            <h2 class="page-title" id="path-title">{{path_title}}</h2>
            <p class="page-desc">{{path_desc}}</p>
            <p class="page-hint-banner" role="note">{{path_goal}}</p>
        </header>
        <div class="path-layout">
            <div class="section-head report-layout-head path-layout-head-left">
                <h3 class="section-title">{{path_section_fill}}</h3>
            </div>
            <div class="section-head report-layout-head path-layout-head-right path-layout-head-result">
                <h3 class="section-title">{{path_result}}</h3>
                <div class="section-head-actions btn-group">
                    <button type="button" class="btn btn-s" id="clearPathHistoryBtn" title="{{btn_clear_path_title}}">{{btn_clear_path}}</button>
                    <button type="button" class="btn btn-p" id="pathSaveBtn" disabled>{{path_save_btn}}</button>
                    <button type="button" class="btn btn-s" onclick="copyMd('pathBody')">{{btn_copy}}</button>
                    <button type="button" class="btn btn-s" onclick="dlMd('pathBody','path_analysis')">{{btn_dl}}</button>
                </div>
            </div>
            <div class="path-col-main">
                <div class="card card-path-fill module-card path-block">
                    <div class="path-fill-setup">
                        <div class="form-field">
                            <label for="pathPeriod">{{path_period_lbl}}</label>
                            <select id="pathPeriod"><option value="">{{path_period_ph}}</option></select>
                        </div>
                        <div class="path-fill-mode-wrap">
                            <p class="path-fill-mode-legend" id="pathModeLegend">{{path_mode_lbl}}</p>
                            <div class="path-fill-mode" role="radiogroup" aria-labelledby="pathModeLegend">
                                <label class="path-mode-opt">
                                    <input type="radio" name="pathFillMode" value="filter" checked>
                                    <span class="path-mode-text">
                                        <span class="path-mode-label">{{path_mode_filter}}</span>
                                        <span class="path-mode-hint">{{path_mode_filter_hint}}</span>
                                    </span>
                                </label>
                                <label class="path-mode-opt">
                                    <input type="radio" name="pathFillMode" value="manual">
                                    <span class="path-mode-text">
                                        <span class="path-mode-label">{{path_mode_manual}}</span>
                                        <span class="path-mode-hint">{{path_mode_manual_hint}}</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="path-fill-details">
                        <div id="pathFilterBlock" class="path-mode-panel">
                            <div class="path-fill-grid">
                                <div class="form-field">
                                    <label for="pathNeedPathUser">{{path_filter_user_lbl}}</label>
                                    <select id="pathNeedPathUser"><option value="">{{path_filter_user_ph}}</option></select>
                                </div>
                                <div class="form-field">
                                    <label for="pathLogCount">{{path_log_count}}</label>
                                    <input type="text" id="pathLogCount" readonly placeholder="{{path_log_count_ph}}">
                                </div>
                            </div>
                        </div>
                        <div id="pathManualBlock" class="path-mode-panel" hidden>
                            <div class="path-fill-grid">
                                <div class="form-field">
                                    <label for="pathUid">{{path_uid}}</label>
                                    <input type="text" id="pathUid" placeholder="86728416">
                                </div>
                                <div class="form-field">
                                    <label for="pathLogCountManual">{{path_log_count}}</label>
                                    <input type="text" id="pathLogCountManual" readonly placeholder="{{path_log_count_ph}}">
                                </div>
                            </div>
                        </div>
                        <div class="path-fill-grid path-fill-grid-common">
                            <div class="form-field">
                                <label for="pathTime">{{path_time}}</label>
                                <input type="text" id="pathTime" placeholder="2026-03-11 12:00:00">
                                <p class="field-hint" id="pathTimeHint">{{path_time_hint}}</p>
                            </div>
                            <div class="form-field">
                                <label for="pathFeedback">{{path_fb}}</label>
                                <input type="text" id="pathFeedback" placeholder="{{path_fb_ph}}">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="module-section path-module-log">
                    <div class="section-head section-head-sub">
                        <h3 class="section-title">{{path_section_log}}</h3>
                    </div>
                    <div class="card module-card card-path-log">
                        <div class="card-head">
                            <span class="card-head-title">{{path_log_lbl}}</span>
                            <span class="card-head-actions">
                            <button type="button" class="btn btn-s" id="pathPickLogDirBtn" hidden>{{path_pick_log_dir_btn}}</button>
                            <label class="btn btn-s btn-file">
                                {{path_log_upload_btn}}
                                <input type="file" id="logFileInput" accept=".csv" hidden>
                            </label>
                            </span>
                        </div>
                        <textarea id="pathLog" rows="10" placeholder="{{path_log_ph}}"></textarea>
                        <div class="card-foot">
                            <span></span>
                            <button type="button" class="btn btn-p" id="pathBtn">{{path_btn}}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="path-col-result">
                <div class="result result-panel result-panel-flush" id="pathResult">
                    <div class="result-body md path-result-md" id="pathBody"></div>
                    <p class="result-placeholder" id="pathResultPlaceholder">完成路径分析后，结果将显示于此</p>
                </div>
                <p class="path-save-hint" id="pathSaveHint" hidden></p>
                <div class="path-saved-panel" id="pathSavedPanel">
                    <h4 class="path-saved-title">{{path_saved_title}}</h4>
                    <p class="path-saved-empty" id="pathSavedEmpty">{{path_saved_empty}}</p>
                    <ul class="path-saved-list" id="pathSavedList"></ul>
                </div>
            </div>
        </div>
        </div>
    </section>

    <section class="panel" id="tab-report" aria-labelledby="report-title">
        <div class="page-stack">
        <header class="page-header page-header-stack">
            <h2 class="page-title" id="report-title">{{report_title}}</h2>
            <p class="page-desc">{{report_desc}}</p>
            <p class="page-hint-banner" role="note">{{report_goal}}</p>
        </header>
        <div class="report-layout">
            <div class="section-head report-layout-head report-layout-head-left">
                <h3 class="section-title">{{report_section_source}}</h3>
            </div>
            <div class="section-head report-layout-head report-layout-head-right">
                <h3 class="section-title">{{report_section_output}}</h3>
                <div class="section-head-actions btn-group">
                    <button type="button" class="btn btn-s" id="clearReportHistoryBtn" title="{{btn_clear_report_title}}">{{btn_clear_report}}</button>
                    <button type="button" class="btn btn-s" onclick="copyMd('reportBody')">{{btn_copy}}</button>
                    <button type="button" class="btn btn-s" onclick="dlMd('reportBody','weekly_report')">{{btn_dl}}</button>
                </div>
            </div>
            <div class="report-col-main">
                <div class="card card-report-in module-card">
                    <div class="form-row form-row-actions">
                        <div class="form-field">
                            <label for="reportPeriod">{{report_period_lbl}}</label>
                            <select id="reportPeriod"><option value="">{{report_period_ph}}</option></select>
                        </div>
                        <div class="form-field form-field-btn">
                            <button type="button" class="btn btn-s" id="reportReloadBtn">{{report_reload_btn}}</button>
                        </div>
                    </div>
                    <div class="form-row full report-block">
                        <div class="form-field">
                            <label for="reportClassified">{{report_classified}} <span class="label-hint">{{report_classified_hint}}</span></label>
                            <textarea id="reportClassified" rows="10" placeholder="{{report_classified_ph}}"></textarea>
                        </div>
                    </div>
                    <div class="form-field report-block">
                        <span class="label-like">{{report_stories_lbl}}</span>
                        <p class="field-hint" id="reportPathStoriesEmpty">{{report_stories_empty}}</p>
                        <div id="reportPathStories" class="report-path-stories"></div>
                    </div>
                    <div class="form-row full report-block">
                        <div class="form-field">
                            <label for="reportPaths">{{report_paths}} <span class="label-hint">{{report_paths_hint}}</span></label>
                            <textarea id="reportPaths" rows="3" placeholder="{{report_paths_ph}}"></textarea>
                        </div>
                    </div>
                    <div class="card-foot">
                        <span></span>
                        <button type="button" class="btn btn-p" id="reportBtn">{{report_btn}}</button>
                    </div>
                </div>
            </div>
            <div class="report-col-result">
                <div class="result result-panel result-panel-flush" id="reportResult">
                    <div class="result-body md report-result-md" id="reportBody"></div>
                    <p class="result-placeholder" id="reportResultPlaceholder">选择周期并生成周报后，结果将显示于此</p>
                </div>
            </div>
        </div>
        </div>
    </section>

</main>

<div class="overlay" id="loading" role="alertdialog" aria-busy="true" aria-label="{{loading_aria}}">
    <div class="spinner-box">
        <div class="spinner" aria-hidden="true"></div>
        <p id="loadingText">{{loading_text}}</p>
    </div>
</div>

<div class="toast-box" id="toastBox" aria-live="polite"></div>

<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
<script src="app.js"></script>
</body>
</html>
