    <section class="panel active" id="tab-classify" aria-labelledby="classify-title">
        <div class="page-stack">
            <header class="page-header page-header-stack">
                <h2 class="page-title" id="classify-title">{{classify_title}}</h2>
                <p class="page-desc">{{classify_desc}}</p>
                <div class="page-hint page-hint-banner">{{classify_hint}}</div>
            </header>

            <div class="card card-stack card-upload">
                <div class="upload-zone" id="uploadArea">
                    <input type="file" id="fileInput" accept=".csv,.txt,.xlsx,.xls" hidden>
                    <button type="button" class="btn btn-upload" id="pickFileBtn">{{btn_pick_file}}</button>
                    <p class="upload-help">{{upload_help}}</p>
                    <p class="upload-file-name" id="uploadFileName" hidden></p>
                </div>
                <div class="upload-extra">
                    <button type="button" class="btn btn-s" id="loadWeekFeedbackBtn">{{btn_week}}</button>
                </div>
            </div>

            <div class="card card-stack card-text">
                <h3 class="stack-heading">{{text_card_title}}</h3>
                <p class="stack-desc">{{text_card_desc}}</p>
                <textarea id="feedbackInput" rows="10" placeholder="{{fb_placeholder}}"></textarea>
                <div class="bar bar-stack">
                    <span class="count" id="feedbackCount">0 {{count_unit}}</span>
                    <button type="button" class="btn btn-s" id="parseFeedbackBtn">{{btn_parse}}</button>
                </div>
            </div>

            <div class="card card-stack batch-card" id="batchPanel" style="display:none;">
                <div class="batch-head">
                    <h3 class="batch-title" id="batchPreviewTitle">{{batch_preview}} 0 {{batch_end}}</h3>
                </div>
                <div class="batch-cta">
                    <button type="button" class="btn btn-primary-lg" id="classifyBtn">{{btn_classify}}</button>
                    <div class="batch-cta-secondary">
                        <button type="button" class="btn btn-s" id="exportBatchBtn" disabled>{{btn_export}}</button>
                        <button type="button" class="btn btn-s" id="cancelClassifyBtn" style="display:none;">{{btn_cancel}}</button>
                    </div>
                </div>
                <div class="batch-progress-wrap">
                    <div class="batch-progress-track"><div class="batch-progress-fill" id="batchProgressFill"></div></div>
                    <span class="batch-progress-text" id="batchProgressText">0 / 0</span>
                </div>
                <div class="batch-table-wrap">
                    <table class="batch-table">
                        <thead>
                            <tr>
                                <th class="col-num">{{th_num}}</th>
                                <th class="col-msg">{{th_msg}}</th>
                                <th class="col-id">{{th_id}}</th>
                                <th class="col-l2">{{th_l2}}</th>
                                <th class="col-module">{{th_module}}</th>
                                <th class="col-path">{{th_path}}</th>
                                <th class="col-result">{{th_detail}}</th>
                            </tr>
                        </thead>
                        <tbody id="batchTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
