
"""
    Description: Our simple flask API with proprietary algorithm that calculates
    optimal route for emergency vehicles and returns it
    Creators: Team Beline for Inrix x AWS ACM hackathon 2024
"""

from flask import Flask, request, jsonify
from geopy.distance import geodesic
from flask_sqlalchemy import SQLAlchemy

# pasth-fiding specific packages
import osmnx as ox
import networkx as nx

app = Flask(__name__)

# ---------------------------------------------------------------------------- #
@app.route('/search')
def search():
    locn_str = request.args.get('locn').strip('"')
    dest_str = request.args.get('dest').strip('"')
    print(locn_str, dest_str)
    try:
        locn_list = locn_str.split(",")
        dest_list = dest_str.split(",")

        locn = (float(locn_list[0]), float(locn_list[1]))
        dest =(float(dest_list[0]), float(dest_list[1]))
    except:
        return {"error": "invalid inputs for dest or locn"}

    print("tuple:", type(locn), locn, dest)

    try:
        route_waypoint_coords = path_algo(locn, dest)
        print(route_waypoint_coords)
        return jsonify({"coord_pairs": route_waypoint_coords})
    except:
        return {"error": "function timed out"}

# ---------------------------------------------------------------------------- #
def path_algo(user_locn, dest):

    print(user_locn)
    straight_dist = (geodesic(user_locn, dest).kilometers * 1000) + 1000 # in meters

    try:
        graph = ox.graph_from_point(center_point=user_locn, dist=straight_dist,simplify=False)
    except:
	       return {"error": "failed to generate graph from given coordinates"}

    starting = ox.nearest_nodes(graph, user_locn[1], user_locn[0])
    ending = ox.nearest_nodes(graph, dest[1], dest[0])

    first_path = nx.shortest_path(graph, starting, ending, 'length')

    print("iterating through node old coords...")
    node_coordinates_old = []
    for node in first_path:
        node_data = graph.nodes[node]
        node_coordinates_old.append([node_data['x'], node_data['y']])

    traffic = []

    for omid in first_path:
        if(graph.nodes[omid].get('highway') == 'traffic_signals'):
            traffic.append(omid)
    for edge in graph.edges(data=True):
        for omid in traffic:
            if(edge[1] == omid):
                edge[2]['length'] += 100

    refined_path = nx.shortest_path(graph, starting, ending, 'length')

    node_coordinates_refined = []
    for node in refined_path:
        node_data = graph.nodes[node]
        node_coordinates_refined.append([node_data['x'], node_data['y']])

    return node_coordinates_refined
