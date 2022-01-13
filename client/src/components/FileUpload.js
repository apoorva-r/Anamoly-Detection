import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "Anamoly Detection/code/backend/client/public/Logo_Uni_Paderborn.svg";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  // eslint-disable-next-line
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const [showResults, setShowResults] = React.useState(false);
  const onClick = () => setShowResults(true);

  const Results = () => (
    <div id="results" className="search-results float-right mt-5">
      <NavLink to="/Plots">
        <Button className="btn-proceed">Proceed</Button>
      </NavLink>
    </div>
  );
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      // eslint-disable-next-line
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        },
      });
      setMessage("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <h1 align="center">
        <img style={{ width: "35%" }} src="image.png" alt="" />
      </h1>
      <br />
      <h3 align="center"> DOORSTEP 2.0</h3>
      <h4 align="center">Anomaly Detection In Sensor Data</h4>
      <br />
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            required
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
          onClick={onClick}
        />
        {showResults ? <Results /> : null}
      </form>

      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
