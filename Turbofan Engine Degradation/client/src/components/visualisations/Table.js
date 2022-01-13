import React, { PureComponent } from "react";
import Table from "react-bootstrap/Table";

export default class Example extends PureComponent {
  static jsfiddleUrl = "https://jsfiddle.net/alidingling/k9jkog04/";

  constructor(props) {
    super(props);
    this.state = {
      dataX: [],
      isLoaded: false,
      animation: true,
    };
  }

  render() {
    // eslint-disable-next-line
    var { isLoaded, dataX } = this.state;
    let plotData = [];
    let sensorObj = {};
    JSON.parse(sessionStorage.getItem("mySessionStorageData")).correlation.map(
      // eslint-disable-next-line
      (value) => {
        sensorObj.sensorA = value.sen_corrA;
        sensorObj.sensorB = value.sen_corrB;
        sensorObj.corVal = value.corr_val;
        plotData.push(sensorObj);
        sensorObj = {};
      }
    );
    const renderTable = (sensorObj, index) => {
      return (
        <tr key={index}>
          <td>{sensorObj.sensorA}</td>
          <td>{sensorObj.sensorB}</td>
          <td>{sensorObj.corVal}</td>
        </tr>
      );
    };

    return (
      <div>
        <h3 style={{ marginTop: "10px", textAlign: "center" }}>
          Correlating Sensors
        </h3>
        <Table
          striped
          bordered
          hover
          variant="dark"
          style={{ marginTop: "40px" }}
        >
          <thead>
            <tr>
              <th>Sensor A</th>
              <th>Sensor B</th>
              <th>Co-relation Value</th>
            </tr>
          </thead>
          <tbody>{plotData.map(renderTable)}</tbody>
        </Table>
      </div>
    );
  }
}
