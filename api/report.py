"""Vercel Serverless Function — 汇总报告"""

import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.classifier import ReportGenerator


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))

            classified_data = body.get('classified_data', '')
            path_results = body.get('path_results', '暂无')

            if not classified_data:
                self._send(400, {'error': '请提供已分类的反馈数据'})
                return

            generator = ReportGenerator()
            result = generator.generate(classified_data, path_results)

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
