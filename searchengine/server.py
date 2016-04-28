from flask import Flask, request, abort, jsonify
from flask.ext.restful import Resource, Api
from searchAPI import SearchAPI
from flask import render_template

app = Flask(__name__)
app.config.from_object('config')
api = Api(app)

@app.route('/')
@app.route('/<name>')
def index(name=None):
    return render_template('../www/index.html', name=name)


api.add_resource(SearchAPI, '/')

if __name__ == '__main__':



	app.run(debug=True,host='0.0.0.0')
