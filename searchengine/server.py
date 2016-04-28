from flask import Flask, request, abort, jsonify
from flask.ext.restful import Resource, Api
from searchAPI import SearchAPI

app = Flask(__name__)
app.config.from_object('config')
api = Api(app)

api.add_resource(SearchAPI, '/')

if __name__ == '__main__':



	app.run(debug=True,host='0.0.0.0')
