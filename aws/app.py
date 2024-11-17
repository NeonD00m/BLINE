"""
    Description: Our simple flask API with proprietary algorithm that calculates
    optimal route for emergency vehicles and returns it
    Creators: Team Beline for Inrix x AWS ACM hackathon 2024
"""

from flask import Flask, request
import math

app = Flask(__name__)

@app.route('/search')
def search():
    locn = request.args.get('locn', default=1, type=int)
    dest = request.args.get('dest', default=1, type=int)
    print(locn, dest)
    try:
        locn = eval(locn)
        dest = eval(dest)

    except:
        return {"error": "invalid inputs for dest or locn"}

    straight_dist = straight_line_dist(locn, dest)
    return f"{locn}, {dest}, {type(locn)}, {straight_dist}"

def straight_line_dist(locn, dest):
    distance = haversine(locn[0], locn[1], dest[0], dest[1])
    print(distance)
    return distance

def path_algo(user_locn, dest):
    return 0
