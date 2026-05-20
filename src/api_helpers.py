"""Vercel Serverless API 公共工具"""

import json
import os
import sys
import tempfile
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)


def setup_revisions_dir() -> None:
    """Vercel 环境使用 /tmp 持久化修订（同实例内有效）"""
    if os.environ.get('VERCEL'):
        d = '/tmp/revisions'
        os.makedirs(d, exist_ok=True)
        os.environ['REVISIONS_DIR'] = d
        for name in ('revision_log.json', 'learned_rules.json'):
            src = os.path.join(ROOT, 'data', 'revisions', name)
            dst = os.path.join(d, name)
            if os.path.exists(src) and not os.path.exists(dst):
                import shutil
                shutil.copy(src, dst)


def read_body(handler: BaseHTTPRequestHandler) -> bytes:
    length = int(handler.headers.get('Content-Length', 0))
    return handler.rfile.read(length) if length else b''


def parse_json(handler: BaseHTTPRequestHandler) -> dict:
    raw = read_body(handler)
    if not raw:
        return {}
    return json.loads(raw.decode('utf-8'))


def parse_multipart(handler: BaseHTTPRequestHandler) -> dict:
    import cgi

    content_type = handler.headers.get('Content-Type', '')
    if 'multipart/form-data' not in content_type:
        return {}

    environ = {
        'REQUEST_METHOD': 'POST',
        'CONTENT_TYPE': content_type,
        'CONTENT_LENGTH': handler.headers.get('Content-Length', '0'),
    }
    form = cgi.FieldStorage(
        fp=handler.rfile,
        headers=handler.headers,
        environ=environ,
    )
    result = {}
    for key in form.keys():
        field = form[key]
        if isinstance(field, list):
            field = field[0]
        if getattr(field, 'filename', None):
            result[key] = {
                'filename': field.filename,
                'data': field.file.read(),
            }
        else:
            result[key] = field.value
    return result


def send_json(handler: BaseHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
    handler.send_response(status)
    handler.send_header('Content-Type', 'application/json; charset=utf-8')
    handler.send_header('Content-Length', str(len(body)))
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type')
    handler.end_headers()
    handler.wfile.write(body)


def ok(data=None, **kwargs):
    payload = {'success': True}
    if data is not None:
        payload['data'] = data
    payload.update(kwargs)
    return payload


def err(message: str, status: int = 400):
    return {'success': False, 'error': message}, status


def save_upload_temp(file_data: bytes, suffix: str) -> str:
    fd, path = tempfile.mkstemp(suffix=suffix)
    os.close(fd)
    with open(path, 'wb') as f:
        f.write(file_data)
    return path
