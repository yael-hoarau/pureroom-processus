const express = require('express')
const app = express()
const port = 3001

//const {InfluxDB, FluxTableMetaData} = require('@influxdata/influxdb-client')
const {url, token, org} = require('./env')
//const { from, map, take, next }             = require('rxjs');

const sqlite = require('./db')
const requests = require('./openhab_requests');
const {launchCron} = require("./cron");
const {getScore} = require("./score");

// const queryApi = new InfluxDB({url, token}).getQueryApi(org)
// const fluxQuery = (measurement) => `from(bucket: "ubiquarium")
//   |> range(start: -1d)
//   |> filter(fn: (r) => r["measurement"] == "${ measurement }")
//   |> filter(fn: (r) => r["location"] == "t1_1_ubiquarium_stand1")
//   |> filter(fn: (r) => r["protocol"] == "netatmo")
//   |> yield(name: "last")`;

app.get('/ON', (req, res) => {
	requests.postON();
	res.send("ON");
});

app.get('/OFF', (req, res) => {
	requests.postOFF();
	res.send("OFF");
});

app.get('/score', (req, res) => {
    const db = sqlite.openReadOnly()

    const sqllite_date = Math.floor(new Date().getTime() / 1000);

    const pr = sqlite.selectScoreFrom(db, sqllite_date - req.query.period);
    pr.then(function (tab){
        res.send(tab);
    })

    sqlite.close(db);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(port)

launchCron()
