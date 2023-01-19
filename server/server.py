import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import requests_cache

from Scrapper.scrapper import getLectureTitles

load_dotenv()
requests_cache.install_cache("/usr/src/cache", backend='filesystem', serializer='json')

app = Flask(__name__)
CORS(app)  # enable CORS for all routes


@app.route("/")
def root():
    return "<h1>VUT FIT website scrapper.</h1>"


@app.route("/lecture-titles/<courseID>")
def lectureTitles(courseID):
    titles = getLectureTitles(courseID)
    return jsonify(titles)

@app.route('/ext/<path:path>')
def send_report(path):
    return send_from_directory('/usr/src/ext', path)


if __name__ == "__main__":
    app.run(host=os.getenv("HOST"), port=os.getenv("PORT"))
