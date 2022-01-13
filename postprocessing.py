import numpy as np
import pandas as pd

def json_output_processing(modelled_data, corr_response):
    json_response = "{"
    corr_key = "\"correlation\":"
    json_response += corr_key
    json_response += corr_response
    cols_sensors = list(modelled_data.keys())
    num_of_sensors = len(cols_sensors)
    if num_of_sensors != 0:
        json_response += ","
        for s in cols_sensors:
            num_of_sensors = num_of_sensors - 1
            key = "\"" + s + "\":"
            json_response += key
            json_response += modelled_data[s].to_json(orient='records')
            if num_of_sensors > 0:
                json_response += ","
    json_response += "}"
    return json_response


def df_correlate(df):
    df = df.drop(columns=['time'])
    cols_const, cols_nan = [], []
    for nr, df_temp in df.groupby('unit_nr'):
        cols_nan = df.columns[df_temp.isna().any()].tolist()
        cols_const = [col for col in df_temp.columns if len(
            df_temp[col].unique()) <= 2 and col != 'unit_nr']
    df = df.drop(columns=cols_const + cols_nan)
    df_corr = df.corr(method='pearson')
    df_corr_lower_triangle = pd.DataFrame(
        np.tril(df_corr.values), columns=df_corr.columns, index=df_corr.index)
    correlating = []
    for col in df_corr_lower_triangle.columns:
        ser = df_corr_lower_triangle[col]
        idx = np.logical_or(-0.8 > ser, ser > 0.8)
        for i, c in zip(ser[idx].index, ser[idx].values):
            if (i, col, c) not in correlating and i != col:
                correlating.append((col, i, c))
    df_corr_data = pd.DataFrame(data=correlating, columns=[
                                    'sen_corrA', 'sen_corrB', 'corr_val'])
    json_corr = df_corr_data.to_json(orient='records')
    return json_corr

