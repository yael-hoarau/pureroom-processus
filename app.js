const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const express = require('express')
const app = express()
const port = 8080

//const {InfluxDB, FluxTableMetaData} = require('@influxdata/influxdb-client')
const {url, token, org} = require('./env')
//const { from, map, take, next }             = require('rxjs');

const sqlite = require('./db')
const requests = require('./openhab_requests');
const {launchCron} = require("./cron");
const {getScore, computeScore} = require("./score");
const cors = require("cors")

app.use(cors({origin: '*'}))

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
    pr.then(function (tab) {
        res.send(tab);
    })

    sqlite.close(db);
});

app.get('/last_score', (req, res) => {
    const db = sqlite.openReadOnly()

    const pr = sqlite.selectLastScore(db);
    pr.then(function (tab) {
        res.send(tab);
    })

    sqlite.close(db);
});

function isNumeric(str) {
    const numericRegExp = /^[-+]?(\d*\.\d+|\d+)$/gm;
    return !!str && str.match(numericRegExp) !== null;
}

app.get('/score/calculate', (req, res) => {
    const {temperature, humidity, co2} = req.query;
    console.log(req.query);

    if ([temperature, humidity, co2].every(isNumeric)) {
        computeScore({
            temperature: parseFloat(temperature), humidity: parseFloat(humidity), co2: parseFloat(co2),
        }).then(score => res.send({value: parseFloat(score), time: Date.now()}))
            .catch(err => {
                res.sendStatus(500);
            });
    } else {
        res.status(400)
            .send('Bad Request: usage should be ' +
                'GET /score/calculate?temperature=<NUMBER>&humidity=<NUMBER>&co2=<NUMBER>');
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(port)

launchCron()
console.log('Cron and API launched');
