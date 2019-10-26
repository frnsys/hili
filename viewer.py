#!/usr/bin/env python
"""
Usage: python viewer.py FILE UPLOAD_DIR
"""

import os
import json
import argparse
from http.server import BaseHTTPRequestHandler, HTTPServer

parser = argparse.ArgumentParser(description='A simple server view saved JSON data')
parser.add_argument('FILE', type=str, help='File to load data from')
parser.add_argument('UPLOAD_DIR', type=str, help='Directory to load files from')
parser.add_argument('-p', '--port', type=int, dest='PORT', default=8889, help='Port for server')
args = parser.parse_args()


class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        data = []
        with open(args.FILE, 'r') as f:
            for l in f.read().splitlines():
                data.append(json.loads(l))

        # Reverse chron
        html = ['''
            <html>
                <head>
                    <meta charset="utf8">
                    <style>
                        html {
                            overflow-x: hidden;
                        }
                        article {
                            margin: 4em auto;
                            max-width: 720px;
                            line-height: 1.4;
                            padding-bottom: 4em;
                            border-bottom: 2px solid black;
                            font-family: sans-serif;
                        }
                        .tags {
                            margin-top: 1em;
                            font-size: 0.8em;
                        }
                        a {
                            color: blue;
                        }
                        img {
                            max-width: 100%;
                        }
                    </style>
                </head>
                <body>''']

        for d in data[::-1]:
            if 'file' in d:
                fname = d['file']['name']
                html.append('''
                    <article>
                        <h4><a href="{href}">{title}</a></h4>
                        <img src="{src}">
                        <p>{text}</p>
                        <div class="tags"><em>{tags}</em></div>
                    </article>
                '''.format(
                    href=d['href'],
                    title=d['title'],
                    # src=os.path.join(args.UPLOAD_DIR, fname),
                    src=d['file']['src'],
                    text=d['text'],
                    tags=', '.join(d['tags'])
                ))
            else:
                html.append('''
                    <article>
                        <h4><a href="{href}">{title}</a></h4>
                        {html}
                        <div class="tags"><em>{tags}</em></div>
                    </article>
                '''.format(
                    href=d['href'],
                    title=d['title'],
                    html=d['html'],
                    tags=', '.join(d['tags'])
                ))

        html.append('</body></html>')

        # Response
        html = '\n'.join(html).encode('utf8')
        self.wfile.write(html)
        return

if __name__ == '__main__':
    print('Running on port', args.PORT)
    server = HTTPServer(('localhost', args.PORT), RequestHandler)
    server.serve_forever()

