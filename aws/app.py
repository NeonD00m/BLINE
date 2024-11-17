
"""
    Description: Our simple flask API with proprietary algorithm that calculates
    optimal route for emergency vehicles and returns it
    Creators: Team Beline for Inrix x AWS ACM hackathon 2024
"""

from flask import Flask, request
import math

# pasth-fiding specific packages
import osmnx as ox
import networkx as nx

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

    path_algo(locn, dest)
    return f"{locn}, {dest}, {type(locn)}, {straight_dist}"

def straight_line_dist(locn, dest):
    distance = haversine(locn[0], locn[1], dest[0], dest[1])
    print(distance)
    return distance

def path_algo(user_locn, dest):
    graph = ox.graph_from_point(center_point=user_locn, dist=10000, simplify=False)
    #graph = ox.convert_to_undirected(graph)
    #graph = ox.consolidate_intersections(graph, 5.7, True, True, True)

    traffic_light_nodes = [
        node for node, data in graph.nodes(data=True)
        if data.get('highway') == 'traffic_signals'
    ]

    traffic_light_edges = [
        node for node, data in graph.edges(data=True)
        if data.get('highway') == 'traffic_signals'
    ]

    #graph.graph["simplified"] = False
    #s_graph = ox.simplify_graph(G=graph, edge_attrs_differ=None, remove_rings=False, track_merged=False)
    #fig, ax = ox.plot_graph(graph)
    starting = ox.nearest_nodes(graph, user_locn[1], user_locn[0])
    ending = ox.nearest_nodes(graph, dest[1], dest[0])
    #print(starting)
    #print(ending)
    shortest_path_nodes = nx.shortest_path(graph, starting, ending, 'length')
    node_coordinates = []
    for node in shortest_path_nodes:
        node_data = graph.nodes[node]
        node_coordinates.append([node_data['x'], node_data['y']])

    print(node_coordinates)
