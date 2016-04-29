from flask import Flask, request, abort, jsonify
from flask.ext.restful import Resource, Api
from searchAPI import SearchAPI
from recommendAPI import recommendAPI

app = Flask(__name__)
app.config.from_object('config')
api = Api(app)

api.add_resource(SearchAPI, '/search')
api.add_resource(recommendAPI, '/recommend')

# Routes
@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

if __name__ == '__main__':
	app.run(debug=True,host='0.0.0.0')
