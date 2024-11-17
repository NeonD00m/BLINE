import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt

#coords = (-121.961640, 37.400800)
coords = (37.400800, -121.961640)
dest_coords = (37.352039, -121.937393)

graph = ox.graph_from_point(center_point=coords, dist=10000,simplify=False)
#graph = ox.convert_to_undirected(graph)
#graph = ox.consolidate_intersections(graph, 5.7, True, True, True)

#graph.graph["simplified"] = False
#s_graph = ox.simplify_graph(G=graph, edge_attrs_differ=None, remove_rings=False, track_merged=False)
#fig, ax = ox.plot_graph(graph)
starting = ox.nearest_nodes(graph, coords[1], coords[0])
ending = ox.nearest_nodes(graph, dest_coords[1], dest_coords[0])
#print(starting)
#print(ending)
shortest_path_nodes = nx.shortest_path(graph, starting, ending, 'length')
node_coordinates = []
for node in shortest_path_nodes:
    node_data = graph.nodes[node]
    node_coordinates.append([node_data['x'], node_data['y']])

print(node_coordinates)

#fig, ax = plt.subplots(figsize=(10, 10))

#ox.plot_graph(graph, ax=ax, node_size=0, bgcolor='w')

#path_edges = list(zip(shortest_path_nodes, shortest_path_nodes[1:]))
#ox.plot_graph_route(graph, shortest_path_nodes, route_linewidth=4, route_color='r', ax=ax)

#plt.show()