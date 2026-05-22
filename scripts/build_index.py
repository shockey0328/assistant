# -*- coding: utf-8 -*-
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TPL = Path(__file__).resolve().parent / "index_body.tpl"
OUT = ROOT / "index.html"
PUBLIC = ROOT / "public" / "index.html"

S = {
    "title": "\u6a59\u5b50\u5b66 \u2014 \u53cd\u9988\u5206\u6790\u52a9\u624b",
    "nav_aria": "\u4e3b\u5bfc\u822a",
    "brand": "\u6a59\u5b50\u5b66",
    "tagline": "\u53cd\u9988\u5206\u6790\u52a9\u624b",
    "logo_alt": "\u5c0f\u6a59\u5b50",
    "nav_settings": "\u8bbe\u7f6e",
    "settings_hub_title": "\u8bbe\u7f6e",
    "s01": "API \u8bbe\u7f6e",
    "workflow_label": "\u5de5\u4f5c\u6d41\u7a0b",
    "s02": "\u53cd\u9988\u5206\u7c7b",
    "s03": "\u8def\u5f84\u5206\u6790",
    "s04": "\u6c47\u603b\u62a5\u544a",
    "classify_goal": "\u5bfc\u5165\u5468\u671f\u53cd\u9988 \u2192 AI \u8bc6\u522b\u9700\u6c42\u4e0e\u6ee1\u8db3\u72b6\u6001 \u2192 \u8868\u683c\u5185\u76f4\u63a5\u4fee\u8ba2\u7ed3\u8bba",
    "path_goal": "\u9009\u62e9\u5df2\u5206\u7c7b\u5468\u671f\u4e0e\u9700\u67e5\u8def\u5f84\u7528\u6237 \u2192 \u52a0\u8f7d\u884c\u4e3a\u65e5\u5fd7 \u2192 \u751f\u6210\u7528\u6237\u6545\u4e8b",
    "report_goal": "\u81ea\u52a8\u62c9\u53d6\u5206\u7c7b\u7ed3\u8bba\u4e0e\u5178\u578b\u8def\u5f84\u6848\u4f8b \u2192 \u4e00\u952e\u751f\u6210\u5185\u5bb9\u53cd\u9988\u5468\u62a5",
    "section_import": "\u5bfc\u5165\u53cd\u9988",
    "section_analyze": "\u6279\u91cf\u5206\u6790\u4e0e\u4fee\u8ba2",
    "path_section_fill": "\u7528\u6237\u4e0e\u5468\u671f",
    "path_section_log": "\u884c\u4e3a\u65e5\u5fd7",
    "report_section_source": "\u5468\u62a5\u6750\u6599",
    "report_section_output": "\u751f\u6210\u7ed3\u679c",
    "settings_goal": "\u914d\u7f6e AI \u63a5\u53e3\u4e0e\u4ea7\u54c1\u77e5\u8bc6\u5e93\uff0c\u4f9b\u5206\u7c7b\u4e0e\u8def\u5f84\u5206\u6790\u5171\u7528",
    "s05": "\u4fee\u8ba2\u7ba1\u7406",
    "s06": "\u4ea7\u54c1\u77e5\u8bc6",
    "rules_ft": "\u5df2\u5b66\u89c4\u5219",
    "rules_pill": "\u89c4\u5219",
    "rules_unit": "\u6761",
    "settings_title": "API \u8bbe\u7f6e",
    "settings_desc": "\u914d\u7f6e AI \u63a5\u53e3\u540e\uff0c\u540e\u7eed\u5206\u7c7b\u3001\u8def\u5f84\u4e0e\u62a5\u544a\u5747\u4f1a\u8c03\u7528\u540c\u4e00\u5957\u51ed\u8bc1\u3002Key \u4ec5\u5b58\u5728\u6d4f\u89c8\u5668 localStorage\u3002",
    "conn_title": "\u8fde\u63a5\u914d\u7f6e",
    "lbl_provider": "API \u63d0\u4f9b\u65b9",
    "lbl_model": "\u6a21\u578b\u540d\u79f0",
    "lbl_key": "API Key",
    "hint_key": "localStorage \u672c\u5730\u5b58\u50a8",
    "lbl_base": "\u81ea\u5b9a\u4e49 Base URL",
    "opt_zhipu": "\u667a\u8c31 BigModel",
    "opt_custom": "\u81ea\u5b9a\u4e49\uff08OpenAI \u517c\u5bb9\uff09",
    "btn_test": "\u6d4b\u8bd5\u8fde\u63a5",
    "btn_save": "\u4fdd\u5b58\u8bbe\u7f6e",
    "guide_title": "\u8bf4\u660e",
    "guide1d": "\u5b98\u65b9\u6216\u4ee3\u7406\uff0c\u63a8\u8350 <code>gpt-4o</code>",
    "guide2d": "\u56fd\u5185\u63a5\u53e3\uff0c\u63a8\u8350 <code>deepseek-chat</code>",
    "guide_zhipu_label": "\u667a\u8c31 GLM",
    "guide_zhipu_d": "open.bigmodel.cn\uff0c\u63a8\u8350 <code>glm-4-flash</code> / <code>glm-4-plus</code>",
    "guide3_label": "\u81ea\u5b9a\u4e49 / \u610f\u601d\u5929\u7a7a",
    "guide3d": "\u586b\u5199\u517c\u5bb9 Base URL \u4e0e Key",
    "warn_key": "API Key \u4ec5\u4fdd\u7559\u5728\u672c\u673a\u6d4f\u89c8\u5668\uff0c\u8bf7\u52ff\u5728\u516c\u5171\u7535\u8111\u4fdd\u5b58\u771f\u5b9e Key\u3002\u672a\u914d\u7f6e\u65f6 AI \u529f\u80fd\u4e0d\u53ef\u7528\u3002",
    "classify_title": "\u53cd\u9988\u5206\u7c7b",
    "classify_desc": "\u4e0a\u4f20\u6216\u7c98\u8d34\u53cd\u9988\uff0cAI \u5206\u6790\u540e\u53ef\u5728\u8868\u683c\u5185\u76f4\u63a5\u4fee\u8ba2\u5206\u7c7b\u4e0e\u7ed3\u8bba\u3002",
    "batch_rules_summary": "\u5df2\u5b66\u89c4\u5219",
    "batch_rev_summary": "\u4fee\u8ba2\u8bb0\u5f55",
    "batch_rev_unit": "\u6761",
    "classify_hint": "\u82e5\u4f7f\u7528\u9879\u76ee\u6839\u76ee\u5f55 .xlsx\uff0c\u8bf7\u5728\u9879\u76ee\u76ee\u5f55\u6267\u884c <code>python -m http.server 8080</code>\uff0c\u7136\u540e\u8bbf\u95ee <code>http://localhost:8080/index.html</code>",
    "import_title": "\u5bfc\u5165\u6570\u636e",
    "import_upload_caption": "\u4e0a\u4f20\u6587\u4ef6",
    "import_text_caption": "\u7c98\u8d34\u6216\u7f16\u8f91",
    "upload_p": "\u62d6\u62fd\u6587\u4ef6\u5230\u6b64\u5904\uff0c\u6216",
    "upload_link": "\u70b9\u51fb\u9009\u62e9",
    "upload_hint": "\u652f\u6301 .xlsx / .xls / .csv / .txt",
    "divider": "\u6216\u7c98\u8d34 / \u7f16\u8f91\u6587\u672c",
    "fb_placeholder": "\u6bcf\u6761\u53cd\u9988\u4e00\u884c\uff0c\u6216\u7c98\u8d34 CSV / \u81ea\u7531\u6587\u672c\u2026",
    "count_unit": "\u6761",
    "btn_week": "\u52a0\u8f7d\u6d4b\u8bd5\u6587\u4ef6",
    "btn_parse": "\u89e3\u6790\u5e76\u9884\u89c8",
    "btn_edit_doc": "\u7f16\u8f91\u6587\u6863",
    "batch_title": "\u6279\u91cf\u5206\u7c7b",
    "batch_preview": "\u6570\u636e\u9884\u89c8 \u00b7 \u5171",
    "batch_mid": "\u00b7 \u5171",
    "btn_pick_file": "\u9009\u62e9 CSV \u6216 Excel \u6587\u4ef6",
    "upload_help": "\u652f\u6301 .xlsx / .xls / .csv / .txt\uff0c\u53ef\u62d6\u62fd\u5230\u4e0a\u65b9\u533a\u57df\u4e0a\u4f20",
    "text_card_title": "\u53cd\u9988\u6570\u636e",
    "text_card_desc": "\u7c98\u8d34\u6216\u7f16\u8f91\u539f\u59cb\u53cd\u9988\uff0c\u89e3\u6790\u540e\u53ef\u9884\u89c8\u5e76\u6279\u91cf\u5206\u7c7b",
    "batch_end": "\u6761",
    "btn_export": "\u5bfc\u51fa\u7ed3\u679c",
    "btn_cancel": "\u53d6\u6d88",
    "btn_clear_classify": "\u6e05\u7a7a\u5206\u6790",
    "btn_clear_path": "\u6e05\u7a7a\u8def\u5f84",
    "btn_clear_path_title": "\u6e05\u7a7a\u672c\u5468\u671f\u5df2\u4fdd\u5b58\u7684\u8def\u5f84\u6848\u4f8b\uff0c\u4fbf\u4e8e\u91cd\u65b0\u5206\u6790",
    "btn_clear_report": "\u6e05\u7a7a\u5468\u62a5",
    "btn_clear_report_title": "\u6e05\u7a7a\u672c\u5468\u671f\u5df2\u751f\u6210\u7684\u5468\u62a5\u6b63\u6587\uff0c\u4fbf\u4e8e\u91cd\u65b0\u751f\u6210",
    "btn_clear_period_all": "\u6e05\u7a7a\u5168\u90e8\u8bb0\u5f55",
    "settings_data_title": "\u5f53\u524d\u5468\u671f",
    "settings_data_desc": "\u6e05\u7a7a\u540e\u53ef\u91cd\u65b0 AI \u5206\u6790\u3001\u8def\u5f84\u5206\u6790\u4e0e\u751f\u6210\u5468\u62a5\uff08\u4e0d\u5f71\u54cd API \u914d\u7f6e\u4e0e\u4ea7\u54c1\u77e5\u8bc6\uff09",
    "settings_clear_all_title": "\u6e05\u7a7a\u5f53\u524d\u5468\u671f\u7684\u5206\u7c7b\u3001\u8def\u5f84\u4e0e\u5468\u62a5 AI \u8bb0\u5f55",
    "btn_classify": "\u5f00\u59cb AI \u5206\u6790",
    "btn_confirm_classify": "\u786e\u8ba4\u5206\u7c7b",
    "classify_confirm_hint": "\u786e\u8ba4\u540e\u5c06\u540c\u6b65\u300c\u9700\u67e5\u8def\u5f84\u300d\u4e0e\u5206\u6790\u7ed3\u8bba\u81f3\u300c\u8def\u5f84\u5206\u6790\u300d\u4e0e\u300c\u6c47\u603b\u62a5\u544a\u300d",
    "th_num": "\u5e8f\u53f7",
    "th_l1": "\u4e00\u7ea7\u5206\u7c7b\u6807\u7b7e",
    "th_l2_src": "\u4e8c\u7ea7\u5206\u7c7b\u6807\u7b7e",
    "th_msg": "\u6709\u6548\u4fe1\u606f",
    "th_member": "\u7528\u6237\u8eab\u4efd",
    "th_user_id": "\u7528\u6237ID",
    "th_time": "\u53cd\u9988\u65f6\u95f4",
    "th_l2_ai": "AI\u4e8c\u7ea7\u5206\u7c7b",
    "th_l2": "\u4e8c\u7ea7\u5206\u7c7b",
    "th_module": "\u5173\u8054\u6a21\u5757",
    "th_detail": "\u5206\u6790\u8be6\u60c5",
    "th_path": "\u8def\u5f84\u5206\u6790",
    "th_result": "\u5206\u7c7b\u7ed3\u679c",
    "path_title": "\u7528\u6237\u8def\u5f84\u5206\u6790",
    "path_desc": "\u7ed3\u5408\u884c\u4e3a\u65e5\u5fd7\uff0c\u5b9a\u4f4d\u53cd\u9988\u5bf9\u5e94\u8d44\u6e90\u5e76\u7f16\u7ec7\u7528\u6237\u6545\u4e8b\u3002",
    "path_user_title": "\u5feb\u901f\u586b\u5145",
    "path_period_lbl": "\u9009\u62e9\u53cd\u9988\u5468\u671f",
    "path_period_ph": "\u8bf7\u9009\u62e9\u5468\u671f",
    "path_mode_lbl": "\u586b\u5145\u65b9\u5f0f",
    "path_mode_filter": "\u7b5b\u9009",
    "path_mode_filter_hint": "\u4ece\u8be5\u5468\u671f\u5df2\u5206\u7c7b\u4e14\u52fe\u9009\u300c\u9700\u67e5\u8def\u5f84\u300d\u7684\u7528\u6237\u4e2d\u9009\u62e9",
    "path_mode_manual": "\u81ea\u4e3b\u586b\u5199",
    "path_mode_manual_hint": "\u624b\u52a8\u8f93\u5165\u7528\u6237 ID \u5e76\u52a0\u8f7d\u65e5\u5fd7",
    "path_filter_user_lbl": "\u9700\u67e5\u8def\u5f84\u7528\u6237",
    "path_filter_user_ph": "\u8bf7\u5148\u5728\u8be5\u5468\u671f\u5b8c\u6210\u53cd\u9988\u5206\u7c7b\u5e76\u52fe\u9009\u9700\u67e5\u8def\u5f84",
    "path_uid": "\u7528\u6237 ID",
    "path_time": "\u53cd\u9988\u65f6\u95f4",
    "path_time_hint": "\u4ece\u5206\u7c7b\u8868\u540c\u6b65\uff0c\u7528\u4e8e\u622a\u53d6\u8be5\u65f6\u95f4\u70b9\u524d\u7684\u884c\u4e3a\u65e5\u5fd7",
    "path_log_window_hint": "\u9ed8\u8ba4\u53d6\u53cd\u9988\u65f6\u95f4\u524d 30 \u5206\u949f\u5185\u7684\u884c\u4e3a\u8bb0\u5f55",
    "path_log_count": "\u65e5\u5fd7\u6761\u6570",
    "path_log_count_ph": "\u52a0\u8f7d\u540e\u81ea\u52a8\u586b\u5145",
    "path_fb": "\u53cd\u9988\u539f\u6587",
    "path_fb_ph": "\u7528\u6237\u7559\u8a00\u6458\u8981",
    "path_log_title": "\u884c\u4e3a\u65e5\u5fd7",
    "path_log_lbl": "\u884c\u4e3a\u65e5\u5fd7",
    "path_log_upload_btn": "\u4e0a\u4f20 CSV",
    "path_pick_log_dir_btn": "\u9009\u62e9\u65e5\u5fd7\u76ee\u5f55",
    "path_log_ph": "user_id,timestamp,event_type,page_name,module,action_detail\u2026",
    "path_btn": "\u5206\u6790\u8def\u5f84",
    "path_result": "\u8def\u5f84\u5206\u6790\u7ed3\u679c",
    "path_save_btn": "\u4fdd\u5b58\u81f3\u6c47\u603b\u62a5\u544a",
    "path_saved_title": "\u672c\u5468\u671f\u5df2\u4fdd\u5b58",
    "path_saved_empty": "\u6682\u65e0\uff0c\u5206\u6790\u540e\u70b9\u300c\u4fdd\u5b58\u81f3\u6c47\u603b\u62a5\u544a\u300d\u540c\u6b65",
    "btn_copy": "\u590d\u5236",
    "btn_dl": "\u4e0b\u8f7d",
    "report_title": "\u6c47\u603b\u62a5\u544a",
    "report_desc": "\u57fa\u4e8e\u5206\u7c7b\u4e0e\u8def\u5f84\u7ed3\u679c\uff0c\u751f\u6210\u6a59\u5b50\u5b66\u5185\u5bb9\u53cd\u9988\u5468\u62a5\u3002",
    "report_in_title": "\u8f93\u5165\u6750\u6599",
    "report_period_lbl": "\u9009\u62e9\u53cd\u9988\u5468\u671f",
    "report_period_ph": "\u8bf7\u9009\u62e9\u5468\u671f",
    "report_reload_btn": "\u5237\u65b0\u672c\u5468\u671f\u6570\u636e",
    "report_classified": "\u5df2\u5206\u7c7b\u53cd\u9988\u7ed3\u8bba",
    "report_classified_hint": "\u9009\u5468\u671f\u540e\u81ea\u52a8\u586b\u5145\uff0c\u53ef\u7f16\u8f91",
    "report_classified_ph": "\u9009\u62e9\u5468\u671f\u540e\u81ea\u52a8\u751f\u6210\uff0c\u6216\u624b\u52a8\u7c98\u8d34\u2026",
    "report_stories_lbl": "\u5178\u578b\u7528\u6237\u6545\u4e8b\uff08\u8def\u5f84\u5206\u6790\uff09",
    "report_stories_empty": "\u6682\u65e0\u8def\u5f84\u6848\u4f8b\uff0c\u8bf7\u5728\u300c\u8def\u5f84\u5206\u6790\u300d\u5206\u6790\u540e\u70b9\u300c\u4fdd\u5b58\u81f3\u6c47\u603b\u62a5\u544a\u300d",
    "report_paths": "\u8def\u5f84\u6750\u6599\u8865\u5145",
    "report_paths_hint": "\u53ef\u9009",
    "report_paths_ph": "\u989d\u5916\u8def\u5f84\u6458\u5f55\u6216\u5907\u6ce8\u2026",
    "report_btn": "\u751f\u6210\u5468\u62a5",
    "report_result": "\u6a59\u5b50\u5b66\u5185\u5bb9\u53cd\u9988\u5468\u62a5",
    "revise_title": "\u4fee\u8ba2\u7ba1\u7406",
    "revise_desc": "\u8bb0\u5f55\u5206\u7c7b\u4fee\u8ba2\uff0cAI \u4f1a\u5b66\u4e60\u4f60\u7684\u5224\u65ad\u903b\u8f91\u3002",
    "rev_form": "\u65b0\u589e\u4fee\u8ba2",
    "rev_id": "\u53cd\u9988\u5e8f\u53f7",
    "rev_from": "AI \u539f\u59cb\u5206\u7c7b",
    "rev_to": "\u4fee\u8ba2\u4e3a",
    "rev_text": "\u53cd\u9988\u539f\u6587",
    "rev_text_ph": "\u7528\u6237\u7559\u8a00",
    "rev_reason": "\u4fee\u8ba2\u539f\u56e0",
    "rev_reason_ph": "\u4e3a\u4ec0\u4e48\u9700\u8981\u6539\u5206\u7c7b",
    "rev_rule": "\u5b66\u5230\u7684\u89c4\u5219",
    "rev_rule_hint": "\u53ef\u9009\uff0c\u4f9b\u540e\u7eed\u5206\u6790\u53c2\u8003",
    "rev_rule_ph": "\u4ece\u6b64\u4fee\u8ba2\u4e2d\u63d0\u70bc\u7684\u5206\u7c7b\u89c4\u5219",
    "rev_btn": "\u63d0\u4ea4\u4fee\u8ba2",
    "rules_h3": "\u5df2\u5b66\u89c4\u5219",
    "rules_empty": "\u6682\u65e0\u89c4\u5219",
    "rev_hist": "\u4fee\u8ba2\u5386\u53f2",
    "rev_empty": "\u6682\u65e0\u4fee\u8ba2\u8bb0\u5f55",
    "know_title": "\u6a59\u5b50\u5b66\u4ea7\u54c1\u77e5\u8bc6",
    "know_desc": "AI \u5206\u6790\u65f6\u53c2\u7167\u4ea7\u54c1\u529f\u80fd\u8bf4\u660e\u3002\u5728\u300c\u77e5\u8bc6\u7ef4\u62a4\u300d\u540c\u6b65\u672c\u671f\u53d8\u66f4\uff0c\u4e0b\u65b9\u300c\u4ea7\u54c1\u53c2\u8003\u300d\u4e3a\u6a21\u5757\u4e0e\u573a\u666f\u5bf9\u7167\u8868\u3002",
    "know_ai_title": "AI \u77e5\u8bc6\u7ef4\u62a4",
    "know_ai_desc": "\u8d34\u4e0a\u672c\u671f\u4ea7\u54c1\u529f\u80fd\u589e\u5220\u3001\u8c03\u6574\u6216\u4e0b\u7ebf\u8bf4\u660e\uff0c\u7531 AI \u6574\u7406\u5e76\u5199\u5165\u300c\u52a8\u6001\u8865\u5145\u77e5\u8bc6\u300d\uff0c\u540e\u7eed\u5206\u7c7b\u4e0e\u8def\u5f84\u5206\u6790\u5747\u4f1a\u4f7f\u7528\u3002",
    "know_ai_sync_lbl": "\u672c\u671f\u4ea7\u54c1\u53d8\u66f4\u8bf4\u660e",
    "know_ai_sync_ph": "\u4f8b\uff1a\u3010\u65b0\u589e\u3011XX \u6a21\u5757\u2026\u3010\u8c03\u6574\u3011\u540c\u6b65\u5b66\u2026\u3010\u4e0b\u7ebf\u3011\u65e7\u7248\u5165\u53e3\u2026",
    "know_ai_btn": "AI \u8865\u5145\u5e76\u66f4\u65b0",
    "know_ai_save": "\u4ec5\u4fdd\u5b58\u8865\u5145",
    "know_ai_extra_lbl": "\u52a8\u6001\u8865\u5145\u77e5\u8bc6",
    "know_ai_extra_hint": "\u53ef\u624b\u52a8\u7f16\u8f91\uff0c\u4fdd\u5b58\u540e\u751f\u6548",
    "know_ai_extra_ph": "AI \u8865\u5145\u6216\u624b\u52a8\u7ef4\u62a4\u7684\u4ea7\u54c1\u77e5\u8bc6\u5c06\u663e\u793a\u5728\u6b64\u2026",
    "know_ref_title": "\u4ea7\u54c1\u53c2\u8003",
    "know_ref_hint": "AI \u5206\u6790\u65f6\u5bf9\u7167\u7684\u6a21\u5757\u4e0e\u573a\u666f\u6620\u5c04",
    "cat_find": "\u67e5\u627e\u8d44\u6e90",
    "cat_err": "\u5185\u5bb9\u9519\u8bef",
    "cat_miss": "\u5185\u5bb9\u9700\u6c42",
    "cat_pending": "\u65e0\u6548\u53cd\u9988",
    "loading_aria": "\u52a0\u8f7d\u4e2d",
    "loading_text": "AI \u5206\u6790\u4e2d\u2026",
}


def knowledge_html() -> str:
    pub = PUBLIC.read_text(encoding="utf-8")
    lines = pub.splitlines()
    i0 = next(i for i, line in enumerate(lines) if 'class="knowledge-content"' in line)
    depth = 0
    i1 = i0
    for i in range(i0, len(lines)):
        depth += lines[i].count("<div") - lines[i].count("</div>")
        if i > i0 and depth == 0:
            i1 = i
            break
    know = "\n".join(lines[i0 : i1 + 1])
    know = know.replace('class="knowledge-content"', 'class="know-wrap"', 1)
    reps = [
        ("knowledge-nav", "card"),
        ("knowledge-table", "k-table"),
        ("module-tag", "mtag"),
        ("knowledge-modules", "card"),
        ("module-cards", "mcards"),
        ("module-card-header", "mcard-hd"),
        ("module-card-body", "mcard-bd"),
        ("module-item", "mcard-item"),
        ("module-card", "mcard"),
        ("scene-search", "bg1"),
        ("scene-practice", "bg2"),
        ("scene-sync", "bg3"),
        ("scene-exam", "bg4"),
        ("scene-holiday", "bg5"),
        ("knowledge-features", "card"),
        ("feature-tags", "ftags"),
        ("feature-tag", "ftag"),
    ]
    for a, b in reps:
        know = know.replace(a, b)
    return re.sub(r"<h3>", '<h3 class="card-title">', know)


def main():
    html = TPL.read_text(encoding="utf-8")
    S["opts_from"] = "".join(
        f'<option value="{S[f"cat_{c}"]}">{S[f"cat_{c}"]}</option>'
        for c in ("find", "err", "miss", "pending")
    )
    S["opts_to"] = "".join(
        f'<option>{S[f"cat_{c}"]}</option>' for c in ("find", "err", "miss")
    )
    S["knowledge"] = knowledge_html()
    for key, val in S.items():
        html = html.replace("{{" + key + "}}", val)
    OUT.write_text(html, encoding="utf-8")
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
