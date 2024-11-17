import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt

place_name = "Santa Clara, Santa Clara County, California, United States"

graph = ox.graph_from_place(query=place_name, simplify=False)
graph = ox.project_graph(graph, to_latlong=True)
#graph = ox.convert_to_undirected(graph)
#graph = ox.consolidate_intersections(graph, 5.7, True, True, True)

#graph.graph["simplified"] = False
#s_graph = ox.simplify_graph(G=graph, edge_attrs_differ=None, remove_rings=False, track_merged=False)

starting = ox.nearest_nodes(graph, -121.961640, 37.400800)
ending = ox.nearest_nodes(graph, -121.937393, 37.352039)
print(starting)
print(ending)
shortest_path_nodes = nx.shortest_path(graph, starting, ending, 'length')

print(shortest_path_nodes)

#fig, ax = ox.plot_graph(graph)