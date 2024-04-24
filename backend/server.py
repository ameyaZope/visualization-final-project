from json import loads
from flask import Flask
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.manifold import MDS

np.random.seed(0)

app = Flask(__name__)
app.config.from_pyfile("settings.py")

data = pd.read_csv('../data/final_data.csv')


@app.route("/apis/data/scatterplot", methods=['GET'])
def get_mds_data_plot():
    return {
        # TODO : Remove the first 10 data instances, this is just for testing
        'data': loads(data.to_json(orient="records"))
    }


if __name__ == '__main__':
    # Make the server publicly available
    app.run(host='0.0.0.0', port=8080, debug=True)
