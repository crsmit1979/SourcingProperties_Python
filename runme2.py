from flask import Flask, jsonify
app = Flask(__name__)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'cache-control,postman-token,Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Cache-Control', '*')
  return response


@app.route("/api/bears", methods=['GET'])
def getdata():
    d = {
        "data": [
            {
                "id": "1",
                "type":"bear",
                "attributes": {
                    "name": "python"
                }
            },
            {
                "id":"2",
                "type":"bear",
                "attributes": {
                    "name":"python2"
                }
            }
        ]
    }

    return jsonify(d)


app.run(
    host="127.0.0.1",
    port=999,
    debug=True
)