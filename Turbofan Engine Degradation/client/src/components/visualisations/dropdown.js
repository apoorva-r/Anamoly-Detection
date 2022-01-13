import Select from "react-select";
import React, { PureComponent } from "react";
import PlotRoute from "./plotroute";
import * as ReactBootStrap from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default class extends PureComponent {
  static jsfiddleUrl = "//jsfiddle.net/alidingling/9wnuL90w/";

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      animation: true,
    };
  }
  setData(json) {
    sessionStorage.setItem("mySessionStorageData", JSON.stringify(json));
  }

  setOptions() {
    let keys = Object.keys(
      JSON.parse(sessionStorage.getItem("mySessionStorageData"))
    );
    let sensor_values = JSON.parse(
      sessionStorage.getItem("mySessionStorageData")
    );

    let items = [];
    for (let i = 1; i < keys.length; i++) {
      let sensor_array = sensor_values[keys[i]];
      // eslint-disable-next-line
      let contains_anamoly = false;
      sensor_array.forEach((element) => {
        if (element.anomaly !== 0) {
          contains_anamoly = true;
        }
      });
      /* var anomalyText = "";
      if (contains_anamoly) {
        anomalyText = " - contains anomaly";
      } else {
        anomalyText = "";
      } */

      items.push({
        value: keys[i],
        label: keys[i] /*+ anomalyText*/,
        className: "anamoly",
      });
    }
    return items;
  }

  handleChange = (selectedOption) => {
    let option = selectedOption.value;
    let plotData = [];
    let sensorObj = {};
    let range = [];
    JSON.parse(sessionStorage.getItem("mySessionStorageData"))[option].map(
      // eslint-disable-next-line
      (value) => {
        range.push(Math.round((value.yhat_lower + Number.EPSILON) * 100) / 100);
        range.push(Math.round((value.yhat_upper + Number.EPSILON) * 100) / 100);
        sensorObj.range = range;
        sensorObj.sensor =
          Math.round((value.fact + Number.EPSILON) * 100) / 100;
        sensorObj.time = value.time;
        sensorObj.yhat = value.yhat;
        sensorObj.anomaly = value.anomaly;
        plotData.push(sensorObj);
        sensorObj = {};
        range = [];
      }
    );
    sessionStorage.setItem("graphdata", JSON.stringify(plotData));
  };
  getData(json) {
    let obj = json;
    // eslint-disable-next-line
    let data = sessionStorage.getItem("mySessionStorageData", obj);
    data = JSON.parse(data);
  }
  componentDidMount() {
    fetch("http://localhost:5000/process", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        this.setData(json);
        this.getData(json);
        this.setState({
          isLoaded: true,
          dataX: json,
        });
      });
  }

  render() {
    var { isLoaded, dataX } = this.state;
    if (!isLoaded) {
      return (
        <div className="text-center">
          {isLoaded ? (
            dataX
          ) : (
            <Button variant="primary" disabled style={{ marginTop: 300 }}>
              <ReactBootStrap.Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                variant="light"
              />
              Loading...
            </Button>
          )}
        </div>
      );
    } else {
    }
    return (
      <div>
        <Select
          id="sensor-id"
          name="form-field-name"
          onChange={this.handleChange}
          options={this.setOptions()}
        ></Select>
        <PlotRoute />
      </div>
    );
  }
}
