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
API_ENDPOINT_REVIEWS = "http://localhost:1337/reviews"
API_ENDPOINT_RESTAURANTS = "http://localhost:1337/restaurants"

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
            # sending post request and saving response as response object
            r = requests.post(API_ENDPOINT_REVIEWS, json.dumps(data))
            #print(r.text)
            SimpleHTTPRequestHandler.do_GET(self)
        except Exception as e:
            err = str(e)
            print("Bad form. Missing " + err + ".")
            self.send_response(204)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

    def do_PUT(self):
        # Decode the form data.
        length = int(self.headers.get('Content-length', 0))
        body = self.rfile.read(length).decode()
        params = parse_qs(body)

        try:
            # data to be sent to api
            restaurant_id = params["restaurant_id"][0]

            data = {"is_favorite": bool(int(params["is_favorite"][0]))}

            url = API_ENDPOINT_RESTAURANTS + "/" + restaurant_id + "/"
            r = requests.put(url, json.dumps(data))
            #print(r.text)
            SimpleHTTPRequestHandler.do_GET(self)
        except Exception as e:
            err = str(e)
            print("Bad form. Missing " + err + ".")
            self.send_response(204)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

if __name__ == '__main__':
    httpd = HTTPServer((ADDRESS, PORT), PostHandler)
    print("Serving on", ADDRESS, ":", PORT)
    httpd.serve_forever()
