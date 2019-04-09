import argparse
from http.server import BaseHTTPRequestHandler, HTTPServer

parser = argparse.ArgumentParser(description='A simple fake server for testing your API client.')
parser.add_argument('FILE', type=str, help='File to save received data')
parser.add_argument('-p', '--port', type=int, dest='PORT', default=8888, help='Port for server')
args = parser.parse_args()

class JSONRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        # Get data
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))
        self.send_response(200)
        self.end_headers()

        # Save data
        with open(args.FILE, 'a') as f:
            f.write(self.data_string.decode('utf8') + '\n')

        # Response
        self.wfile.write(b'ok')
        return

if __name__ == '__main__':
    print('Running on port', args.PORT)
    server = HTTPServer(('localhost', args.PORT), JSONRequestHandler)
    server.serve_forever()