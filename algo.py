import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt

#coords = (-121.961640, 37.400800)
coords = (37.400800, -121.961640)
dest_coords = (37.352039, -121.937393)

graph = ox.graph_from_point(center_point=coords, dist=10000,simplify=False)

starting = ox.nearest_nodes(graph, coords[1], coords[0])
ending = ox.nearest_nodes(graph, dest_coords[1], dest_coords[0])

first_path = nx.shortest_path(graph, starting, ending, 'length')

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