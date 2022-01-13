import React, { PureComponent } from "react";

import {
  ComposedChart,
  Scatter,
  Label,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ZAxis,
} from "recharts";
import "./chart.css";

export default class extends PureComponent {
  static jsfiddleUrl = "//jsfiddle.net/alidingling/9wnuL90w/";

  constructor(props) {
    super(props);
    this.state = {
      dataX: [],
      isLoaded: false,
      animation: true,
    };
  }

  render() {
    var plotData = JSON.parse(sessionStorage.getItem("graphdata"));
    let betterPlotData = [];
    plotData.forEach((elem) => {
      if (elem.anomaly !== 0) {
        betterPlotData.push({
          range: elem.range,
          time: elem.time,
          yhat: elem.yhat,
          anomaly: elem.anomaly,
          anomalyPoint: elem.sensor,
        });
      } else {
        betterPlotData.push({
          range: elem.range,
          time: elem.time,
          yhat: elem.yhat,
          anomaly: elem.anomaly,
          nonAnomalyPoint: elem.sensor,
        });
      }
    });

    return (
      <div>
        <div style={{ width: "100%", height: 500 }}>
          <ResponsiveContainer>
            <ComposedChart
              width={1000}
              height={500}
              data={betterPlotData}
              margin={{
                top: 50,
                right: 20,
                bottom: 0,
                left: 90,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="time">
                <Label
                  value="TIME"
                  fill="red"
                  offset={0}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis
                
                type="number"
                domain={["dataMin", "dataMax"]}
                label={{
                  value: "SENSOR DATA",
                  fill: "red",
                  angle: -90,
                  dy:15
                }}
              />
              <ZAxis />
              <Tooltip />
              <Legend />
              <Area dataKey="range" fill="green" stroke="green" />
              <Scatter dataKey="nonAnomalyPoint" fill="green" />
              <Scatter dataKey="anomalyPoint" fill="red" />

              <Brush dataKey="range" height={20} stroke="#000000">
                <ComposedChart>
                  <Area dataKey="range" fill="green" stroke="green" />
                  <Scatter dataKey="nonAnomalyPoint" fill="green" />
                  <Scatter dataKey="anomalyPoint" fill="red" />
                </ComposedChart>
              </Brush>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
