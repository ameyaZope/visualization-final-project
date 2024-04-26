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

data = pd.read_csv('../data/final_imputed_data.csv')
file_ptr_world_polygons = open('./atlas/world_polygons_simplified.json')
world_polygons_topo_json = json.load(file_ptr_world_polygons)

file_ptr_lines_polygons = open('./atlas/world_lines_simplified.json')
lines_polygons_topo_json = json.load(file_ptr_lines_polygons)


# Load your data

for year in range(2000, 2021, 1):
    df1 = pd.read_csv('../data/final_imputed_data.csv')
    df1 = df1[df1['Code'] != 'OWID_WRL']
    df1 = df1[df1['Year'] == year]
    df1.dropna(axis=1, how='all', inplace=True)

    # Select columns to use in KMeans, ignoring unnecessary columns
    columns_to_use = ['HDI']
    data_for_clustering = df1[columns_to_use]
    data_for_clustering.fillna(data_for_clustering.mean(), inplace=True)

    # Perform KMeans clustering
    kmeans = KMeans(n_clusters=3, random_state=9572).fit(data_for_clustering)
    km_pred = kmeans.predict(data_for_clustering)
    df1['clusterId'] = km_pred

    for index, row in df1.iterrows():
        data.loc[(data['Year'] == year) & (data['Code'] ==
                                           row['Code']), 'clusterId'] = row['clusterId']


@app.route("/apis/data/scatterplot", methods=['GET'])
def get_mds_data_plot():
    return {
        'data': loads(data.to_json(orient="records"))
    } 


@app.route("/apis/data/choroplethmap", methods=['GET'])
def get_choro_plot():
    return {
        'data': loads(data.to_json(orient="records"))
    } 


@app.route("/apis/data/geospatial/world/lines", methods=['GET'])
def get_world_polygons_map_data():
    return lines_polygons_topo_json


@app.route("/apis/data/geospatial/world/polygons", methods=['GET'])
def get_world_lines_map_data():
    return world_polygons_topo_json


@app.route("/apis/data/pcp", methods=['GET'])
def get_pcp_data():
    return {
        'data': loads(data.to_json(orient="records"))
    }

if __name__ == '__main__':
    # Make the server publicly available
    app.run(host='0.0.0.0', port=8080, debug=True)
    file_ptr_world_polygons.close()
