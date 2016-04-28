from flask import Flask, request, abort, jsonify
from flask.ext.restful import Resource, Api
from searchengine.searchAPI import SearchAPI
from flask import render_template

app = Flask(__name__)
app.config.from_object('config')
api = Api(app)

@app.route('/')
def index():
    return render_template('index.html')


api.add_resource(SearchAPI, '/search')

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
