import osmnx as ox

place_name = "Santa Clara, Santa Clara County, California, United States"

graph = ox.graph_from_place(place_name)
graph = ox.project_graph(graph)
#graph = ox.convert_to_undirected(graph)
graph = ox.consolidate_intersections(graph, 10, True, True, True)

fig, ax = ox.plot_graph(graph)

