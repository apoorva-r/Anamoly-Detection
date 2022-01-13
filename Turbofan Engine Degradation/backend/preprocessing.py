import numpy as np
import pandas as pd
import glob

def create_df_dictionary(filepath):
    datasets = glob.glob(filepath + "*.txt")
    names = ['unit_nr', 'time', 'os_1', 'os_2', 'os_3']
    names += ['sensor_{0:02d}'.format(s + 1) for s in range(22)]
    dict_dataframes = list()
    if len(datasets) != 0:
        for i in range(len(datasets)):
            df = pd.read_csv(datasets[i], sep=' ', header=None, names=names, index_col=False)
            df.dropna(axis=1, how='all', inplace=True)
            dict_dataframes.append(df)
    return dict_dataframes

def rolling_mean_by_unit(df, n):
    cols_sensors = [c for c in df.columns if c.startswith('sensor')]
    df_new = df.copy()
    unit_nrs = df['unit_nr'].unique()
    
    for nr in unit_nrs:
        idx = df['unit_nr'] == nr
        df_new.loc[idx,cols_sensors] = df.loc[idx, cols_sensors].rolling(n, min_periods=1).mean()
    return df_new    

def clean_data(dataframe):
    #remove sensor values whose std deviation is lesser than or equal to n = 4
    sensor_cols_only = dataframe.iloc[:, 5:26]
    df = dataframe.drop(sensor_cols_only.std()[sensor_cols_only.std() <= 4].index, axis=1)
    #apply rolling mean function to sensor data
    dataframe = rolling_mean_by_unit(df, 10)
    pruned_df = prune_data(dataframe)
    return pruned_df

#compress values based on time in all unit_nr
def prune_data(df):
    df_new = pd.DataFrame()
    cols_sensors = [c for c in df.columns if c.startswith('sensor')]
    for sensors in cols_sensors:
        df_new[sensors] = df.groupby('time')[sensors].mean()

    df_new['unit_nr']= np.ones(len(df['time'].unique()))
    df_new ['time'] = [ i for i in range(1, len(df_new) + 1)]
    return df_new

