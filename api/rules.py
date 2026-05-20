"""Vercel Serverless Function — 查询规则和修订记录"""

import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.revision_tracker import RevisionTracker


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            tracker = RevisionTracker()
            self._send(200, {
                'rules': tracker.rules,
                'revisions': tracker.revisions
            })
        except Exception as e:
            self._send(500, {'error': str(e)})

    def do_POST(self):
        """也支持 POST 请求"""
        self.do_GET()

    def _send(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
