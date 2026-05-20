"""Vercel Serverless Function — 修订记录"""

import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.revision_tracker import RevisionTracker


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))

            tracker = RevisionTracker()
            tracker.add_revision(
                feedback_id=body.get('feedback_id', ''),
                original_text=body.get('original_text', ''),
                original_category=body.get('original_category', ''),
                revised_category=body.get('revised_category', ''),
                reason=body.get('reason', ''),
                learned_rule=body.get('learned_rule', '')
            )

            self._send(200, {
                'status': 'ok',
                'rules_count': tracker.get_rules_count()
            })

        except Exception as e:
            self._send(500, {'error': str(e)})

    def _send(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
