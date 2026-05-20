"""Vercel Serverless Function — 路径分析"""

import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.classifier import PathAnalyzer


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))

            user_id = body.get('user_id', '')
            feedback_text = body.get('feedback_text', '')
            feedback_time = body.get('feedback_time', '')
            behavior_log = body.get('behavior_log', '')

            if not user_id or not behavior_log:
                self._send(400, {'error': '请提供用户ID和行为日志'})
                return

            analyzer = PathAnalyzer()
            result = analyzer.analyze(
                user_id=user_id,
                feedback_text=feedback_text,
                feedback_time=feedback_time,
                behavior_log_csv=behavior_log
            )

            self._send(200, {'result': result})

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
