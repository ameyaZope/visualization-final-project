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

print(data.head())

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
