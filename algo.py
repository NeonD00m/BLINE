import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt

#coords = (-121.961640, 37.400800)
coords = (37.400800, -121.961640)
dest_coords = (37.352039, -121.937393)

graph = ox.graph_from_point(center_point=coords, dist=10000,simplify=False)
#graph = ox.convert_to_undirected(graph)
#graph = ox.consolidate_intersections(graph, 5.7, True, True, True)

traffic_light_nodes = [
    node for node, data in graph.nodes(data=True)
    if data.get('highway') == 'traffic_signals'
]

traffic_light_edges = [
    [u, v, data] for u, v, data in graph.edges(data=True)
    if data.get('highway') == 'traffic_signals'
]

starting = ox.nearest_nodes(graph, coords[1], coords[0])
ending = ox.nearest_nodes(graph, dest_coords[1], dest_coords[0])
#print(starting)
#print(ending)
old_shortest_path_nodes = nx.shortest_path(graph, starting, ending, 'length')

shortest_path_nodes = []
for node in old_shortest_path_nodes:
    if node in traffic_light_nodes:
        shortest_path_nodes.append(node)

print(shortest_path_nodes)
print()

node_coordinates = []
for node in shortest_path_nodes:
    node_data = graph.nodes[node]
    node_coordinates.append([node_data['x'], node_data['y']])

print(traffic_light_nodes[0])
print(old_shortest_path_nodes[0])

original_graph_edges = graph.edges

nearest_edges = []

for node in node_coordinates:
    nearest_edge = ox.nearest_edges(graph, node[0], node[1])

    # Find edges matching nearest edge's u and v
    corresponding_edges = [
        edge for edge in traffic_light_edges
        if edge[0] == nearest_edges[0] and edge[1] == nearest_edges[1]
    ]
    
    # Get the first matching edge, or None if not found
    corresponding_edge = corresponding_edges[0] if corresponding_edges else None
    
    if corresponding_edge:
        u, v, data = corresponding_edge  # Extract u, v, and data from the edge
        key = data.get("key", 0)  # Default key to 0 for simple graphs
        graph.edges[u, v, key]["length"] += 5000
        print(graph.edges[u, v, key])
        print()

starting = ox.nearest_nodes(graph, coords[1], coords[0])
ending = ox.nearest_nodes(graph, dest_coords[1], dest_coords[0])
#print(starting)
#print(ending)
new_shortest_path_nodes = nx.shortest_path(graph, starting, ending, 'length')

print(shortest_path_nodes == new_shortest_path_nodes)

'''
node_coordinates = []
for node in shortest_path_nodes:
    node_data = graph.nodes[node]
    node_coordinates.append([node_data['x'], node_data['y']])
'''  

'''
for node in traffic_light_nodes:
    nearest_edge = ox.nearest_edges(graph, node['x'], node['y'])
    corresponding_edges = [traffic_light_edges[i] for i in range(len(traffic_light_edges)) if traffic_light_edges[i]["u"] == nearest_edge["u"]]
    corresponding_edge = next((edge for edge in corresponding_edges if edge["v"] == nearest_edge["v"]), None)
    graph.edges[corresponding_edge['u'], corresponding_edge['v'], corresponding_edge['key']]["length"] += 5000
'''

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

#print(node_coordinates)


#fig, ax = plt.subplots(figsize=(10, 10))

#ox.plot_graph(graph, ax=ax, node_size=0, bgcolor='w')

#path_edges = list(zip(shortest_path_nodes, shortest_path_nodes[1:]))
#ox.plot_graph_route(graph, shortest_path_nodes, route_linewidth=4, route_color='r', ax=ax)

#plt.show()