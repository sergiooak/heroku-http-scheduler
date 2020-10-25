const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  console.log("get");
  res.send("http-scheduler v1.0.1");
});

app.post("/*", function (req, res) {
  console.log(`Sending wake up request to ${req.body.host}${req.originalUrl}`);
  axios
    .get(`${req.body.host}${req.originalUrl}`)
    .then(() => {
      // If success, send the next request imediatly
      console.log("Making the real request right now");
      axios
        .post(`${req.body.host}${req.originalUrl}`, req.body)
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log("Scheduling the real request to 30 seconds from now");
      setTimeout(() => {
        console.log("Making the real request after the 30 seconds wait");
        axios
          .post(`${req.body.host}${req.originalUrl}`, req.body)
          .catch(function (error) {
            console.log(error);
          });
      }, 1000 * 30);
    });

  res.send("http-scheduler v1.0.1");
});

let port = process.env.PORT || 3000;
app.listen(port);
