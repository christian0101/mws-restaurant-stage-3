# Server.py App to obtain do_POST data for integrity check.

from http.server import SimpleHTTPRequestHandler, HTTPServer
import os
import logging
import requests
from urllib.parse import unquote, parse_qs
import html
import json

ADDRESS = '0.0.0.0'
PORT = 8000
API_ENDPOINT = "http://localhost:1337/reviews"

web_dir = os.path.join(os.path.dirname(__file__), 'dist')
os.chdir(web_dir)

class PostHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        # Decode the form data.
        length = int(self.headers.get('Content-length', 0))
        body = self.rfile.read(length).decode()
        params = parse_qs(body)

        name = 'Anonymous'
        rating = 1
        comments = ''

        try:
            # data to be sent to api
            data = {
                        "restaurant_id": int(params["restaurant_id"][0]),
                        "name": html.escape(params["name"][0]),
                        "rating": int(params["rating"][0]),
                        "comments": html.escape(params["comments"][0])
                    }
            print(data)
            # sending post request and saving response as response object
            r = requests.post(API_ENDPOINT, json.dumps(data))
            print(r.text)
        except Exception as e:
            err = str(e)
            print("Bad form. Missing " + err + ".")

        SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    httpd = HTTPServer((ADDRESS, PORT), PostHandler)
    print("Serving on", ADDRESS, ":", PORT)
    httpd.serve_forever()
