import pandas as pd
from fbprophet import Prophet
from pythonplot import plot_anomalies
import matplotlib.pyplot as plt


def model_each_sensor_data(df):
    # create a dictionary of output dataframes for each sensor
    sensor_ids = [c for c in df.columns if c.startswith('sensor')]
    dict_dataframes = {}
    for ids in sensor_ids:
        time_values = df['time']
        data_prophet = {'ds': pd.to_datetime(
            df['time'], unit='s'), 'y': df[ids]}
        prophet_df = pd.DataFrame(data_prophet, columns=['ds', 'y'])
        prophet_df = prophet_df.rename(columns={'ds': 'ds', 'y': 'y'})
        pred = fit_predict_model(prophet_df)
        output = detect_anomalies(pred)
        #plot_anomalies(output)
        del output['ds']
        output['time'] = time_values
        dict_dataframes.update({ids:output})
  
    return dict_dataframes

def fit_predict_model(dataframe, interval_width=0.99):
    m = Prophet(interval_width=interval_width,
                yearly_seasonality=False,
                weekly_seasonality=False,
                daily_seasonality=False)
    m = m.fit(dataframe)
    forecast = m.predict(dataframe)
    forecast['fact'] = dataframe['y'].reset_index(drop=True)
    return forecast


def detect_anomalies(forecast):
    forecasted = forecast[['ds', 'yhat',
                           'yhat_lower', 'yhat_upper', 'fact']].copy()

    forecasted['anomaly'] = 0
    forecasted.loc[forecasted['fact'] >
                   forecasted['yhat_upper'], 'anomaly'] = 1
    forecasted.loc[forecasted['fact'] <
                   forecasted['yhat_lower'], 'anomaly'] = -1

    return forecasted
