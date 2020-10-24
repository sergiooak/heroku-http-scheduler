const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  console.log("get");
  res.send("http-scheduler v1.0.0");
});

app.post("/*", function (req, res) {
  console.log(`Sending wake up request to ${req.body.host}${req.originalUrl}`);
  axios.get(`${req.body.host}${req.originalUrl}`).catch(function (error) {
    console.log('The waking up got an error (like always)');
  });

  console.log("Scheduling the real request to one minute from now");
  setTimeout(() => {
    console.log("Making the real request right now");
    axios
      .post(`${req.body.host}${req.originalUrl}`, req.body)
      .catch(function (error) {
        console.log(error);
      });
  }, 1000 * 60);

  res.send("http-scheduler v1.0.0");
});

let port = process.env.PORT || 3000;
app.listen(port);
