# Server.py App to obtain do_POST data for integrity check.

from http.server import SimpleHTTPRequestHandler, HTTPServer
import os
import logging
import requests
from urllib.parse import unquote, parse_qs
import html
import json

authHeaders = {'Authorization': 'Bearer ' + os.environ.get('API_TOKEN', '')}
PORT = 8000
API_ENDPOINT = "https://api-restaurant-reviews.herokuapp.com/"

web_dir = os.path.join(os.path.dirname(__file__), 'dist')
os.chdir(web_dir)

def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

class PostHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        # Decode the form data.
        length = int(self.headers.get('Content-length', 0))
        body = self.rfile.read(length).decode()
        params = parse_qs(body)

        if (is_number(params["restaurant_id"][0])):
            params["restaurant_id"][0] = int(params["restaurant_id"][0])

        try:
            # data to be sent to api
            data = {
                        "restaurant_id": params["restaurant_id"][0],
                        "name": html.escape(params["name"][0]),
                        "rating": int(params["rating"][0]),
                        "comments": html.escape(params["comments"][0])
                    }
            # sending post request and saving response as response object
            r = requests.post(API_ENDPOINT + 'reviews', json.dumps(data), headers = authHeaders)
            print(r.text)
            self.send_response(201)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
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

            url = API_ENDPOINT + "restaurants/" + restaurant_id + "/"
            print(url)
            r = requests.put(url, json.dumps(data), headers = authHeaders)
            print(r.text)
            self.send_response(202)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
        except Exception as e:
            err = str(e)
            print("Bad form. Missing " + err + ".")
            self.send_response(304)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', PORT))   # Use PORT if it's there.
    server_address = ('', port)
    httpd = HTTPServer(server_address, PostHandler)
    httpd.serve_forever()
