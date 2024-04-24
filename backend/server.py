from json import loads
from flask import Flask,jsonify,render_template
import numpy as np
import pandas as pd
import json
from urllib.request import urlopen
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.manifold import MDS

np.random.seed(0)

app = Flask(__name__)
app.config.from_pyfile("settings.py")

data = pd.read_csv('../data/final_data.csv')

with urlopen('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson') as response:
    geo_data = json.load(response)

geo_df = pd.json_normalize(geo_data['features'])
geo_df.drop(columns=['type'], inplace=True)
geo_df.rename(columns={'id': 'Code', 'properties.name': 'Entity'}, inplace=True)
df_final = pd.merge(data, geo_df,  how='left', left_on=['Entity','Code'], right_on = ['Entity','Code'])



@app.route("/apis/data/scatterplot", methods=['GET'])
def get_mds_data_plot():
    return {
        # TODO : Remove the first 10 data instances, this is just for testing
        'data': loads(df_final.to_json(orient="records"))
    } 

@app.route("/apis/data/choromap",methods=['GET'])
def get_choro_plot():
    try:
        return {
        # TODO : Remove the first 10 data instances, this is just for testing
        'data': loads(df_final.to_json(orient="records"))
    } 
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    # Make the server publicly available
    app.run(host='0.0.0.0', port=8080, debug=True)
