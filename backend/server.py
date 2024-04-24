from json import loads
from flask import Flask
import numpy as np
import pandas as pd
import json
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.manifold import MDS

np.random.seed(0)

app = Flask(__name__)
app.config.from_pyfile("settings.py")

data = pd.read_csv('../data/final_data.csv')
file_ptr_world_polygons = open('./atlas/world_polygons_simplified.json')
world_polygons_topo_json = json.load(file_ptr_world_polygons)

file_ptr_lines_polygons = open('./atlas/world_lines_simplified.json')
lines_polygons_topo_json = json.load(file_ptr_lines_polygons)

@app.route("/apis/data/scatterplot", methods=['GET'])
def get_mds_data_plot():
    return {
        # TODO : Remove the first 10 data instances, this is just for testing
        'data': loads(data.to_json(orient="records"))
    } 


@app.route("/apis/data/choroplethmap", methods=['GET'])
def get_choro_plot():
    return {
        # TODO : Remove the first 10 data instances, this is just for testing
        'data': loads(data.to_json(orient="records"))
    } 


@app.route("/apis/data/geospatial/world/lines", methods=['GET'])
def get_world_polygons_map_data():
    return lines_polygons_topo_json


@app.route("/apis/data/geospatial/world/polygons", methods=['GET'])
def get_world_lines_map_data():
    return world_polygons_topo_json


if __name__ == '__main__':
    # Make the server publicly available
    app.run(host='0.0.0.0', port=8080, debug=True)
    file_ptr_world_polygons.close()
