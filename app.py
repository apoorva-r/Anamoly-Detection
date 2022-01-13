# import necessary for flask app
import os
from flask import Flask, flash, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import json
#import _pickle as pickle

# check if needed - none of the calculations should be present on this file move to appropriate subfile.py
import fileinput
import glob
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
# end if

# import of subfile.py
from preprocessing import create_df_dictionary, rolling_mean_by_unit, clean_data
from postprocessing import df_correlate, json_output_processing
from model import model_each_sensor_data
# from pythonplot import plot_anomalies


# variables
UPLOAD_FOLDER = './client/public/uploads/'
ALLOWED_EXTENSIONS = set(['txt'])

app = Flask(__name__)
app.config["DEBUG"] = True
app.secret_key = 'super secret key'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

cors = CORS(app, resources={
            r"/upload": {"origins": "http://x86_64-apple-darwin13.4.0:3000"}})


@cross_origin(origin='localhost', headers=['Content- Type', 'Authorization'])
@app.route('/', methods=['GET'])
def home():
    return "<h1>Anamoly Detection Backend</h1>"


# upload files method
@app.route('/upload', methods=['POST'])
def fileUpload():
    # target = os.path.join(UPLOAD_FOLDER, 'dataset')
    # if not os.path.isdir(target):
    #     os.mkdir(target)
    # this line is for only single file upload needs to be changed!
    files = request.files.getlist("file")
    if len(files) != 0:
        for file in files:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        return "Success..", 200
    else:
        return 'No file uploaded! Bad Request..', 400


@app.route('/process', methods=['POST'])
def process_data():
    dict_dataframes = create_df_dictionary(UPLOAD_FOLDER)
    json_response = ""
    for i in range(len(dict_dataframes)):
        if dict_dataframes[i].empty:
            #print("file is empty")
            if len(dict_dataframes) == 1:
                return 'File is empty! Bad Request..', 400
        else:
            # Cleaning data
            cleaned_df = clean_data(dict_dataframes[i])
            #print("Cleaned data")
            print(cleaned_df)
            cols_sensors = [[c for c in cleaned_df.columns if c.startswith('sensor')]]
            if len(cols_sensors) != 0:
                # Modelling the data
                modelled_sensor_dc = model_each_sensor_data(cleaned_df)
                #print("Modelled data")
                print(modelled_sensor_dc)
                # Performing Correlation between sensors
                corr_response_df = df_correlate(cleaned_df)
                print("Correlation Response\n" + corr_response_df)
                # Creating JSON response
                json_response = json_output_processing(modelled_sensor_dc, corr_response_df)
                print("JSON response" + json_response)
                return json_response
            else:
                return 'Cleaned data does not have any sensors! Bad Request...', 400


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", use_reloader=False)

CORS(app, expose_headers='Authorization')
