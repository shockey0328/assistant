    <section class="panel active" id="tab-classify" aria-labelledby="classify-title">
        <header class="page-header page-header-split">
            <div class="page-header-main">
                <h2 class="page-title" id="classify-title">{{classify_title}}</h2>
                <p class="page-desc">{{classify_desc}}</p>
            </div>
            <div class="page-hint">{{classify_hint}}</div>
        </header>
        <div class="card card-import">
            <h3 class="card-title">{{import_title}}</h3>
            <div class="import-grid">
                <div class="import-col-upload">
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon" aria-hidden="true">&#128193;</div>
                        <p>{{upload_p}} <label for="fileInput">{{upload_link}}</label></p>
                        <input type="file" id="fileInput" accept=".csv,.txt,.xlsx,.xls" hidden>
                        <p class="upload-hint">{{upload_hint}}</p>
                    </div>
                    <p class="import-or">{{divider}}</p>
                </div>
                <div class="import-col-text">
                    <textarea id="feedbackInput" rows="12" placeholder="{{fb_placeholder}}"></textarea>
                    <div class="bar bar-flush">
                        <span class="count" id="feedbackCount">0 {{count_unit}}</span>
                        <div class="btn-group">
                            <button type="button" class="btn btn-s" id="loadWeekFeedbackBtn">{{btn_week}}</button>
                            <button type="button" class="btn btn-s" id="parseFeedbackBtn">{{btn_parse}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card batch-card" id="batchPanel" style="display:none;">
            <div class="batch-toolbar">
                <h3 class="batch-title" id="batchPreviewTitle">{{batch_title}} {{batch_mid}} 0 {{batch_end}}</h3>
                <div class="batch-actions">
                    <button type="button" class="btn btn-s" id="exportBatchBtn" disabled>{{btn_export}}</button>
                    <button type="button" class="btn btn-s" id="cancelClassifyBtn" style="display:none;">{{btn_cancel}}</button>
                    <button type="button" class="btn btn-batch" id="classifyBtn">{{btn_classify}}</button>
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
                            <th class="col-path">{{th_path}}</th>
                            <th class="col-result">{{th_result}}</th>
                        </tr>
                    </thead>
                    <tbody id="batchTableBody"></tbody>
                </table>
            </div>
        </div>
    </section>
