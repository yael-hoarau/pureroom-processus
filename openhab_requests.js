const axios = require("axios");

let config1 = {
    headers: {
        'Content-Length': 1,
        'Content-Type': 'text/plain'
    },
    responseType: 'text'
};

let config2 = {
    headers: {
        'Content-Length': 2,
        'Content-Type': 'text/plain'
    },
    responseType: 'text'
};

let config3 = {
    headers: {
        'Content-Length': 3,
        'Content-Type': 'text/plain'
    },
    responseType: 'text'
};

module.exports = {
    postOFF: function(){
        axios.post('http://oh.sia.fp2WM5WvNEVHZogvpLOA1xGybZvtHYoOG0fdnm7cALmWptLRHpDUjo2LtcIBS9Xtd2Pgvx95WZZQRuXCdhMrQ@openhab.ubiquarium.fr/rest/items/LightRGBTradfri02_Color_Temperature', '0', config1)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    postON: function(){
        axios.post('http://oh.sia.fp2WM5WvNEVHZogvpLOA1xGybZvtHYoOG0fdnm7cALmWptLRHpDUjo2LtcIBS9Xtd2Pgvx95WZZQRuXCdhMrQ@openhab.ubiquarium.fr/rest/items/LightRGBTradfri02_Color_Temperature', '100', config3)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    postNb: function(nb){
        nb = nb.toString();
        let config = nb.length === 2 ? config2 : (nb.length === 1 ? config1 : config3)
        axios.post('http://oh.sia.fp2WM5WvNEVHZogvpLOA1xGybZvtHYoOG0fdnm7cALmWptLRHpDUjo2LtcIBS9Xtd2Pgvx95WZZQRuXCdhMrQ@openhab.ubiquarium.fr/rest/items/LightRGBTradfri02_Color_Temperature', nb, config)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    getCO2: function (){
        return axios.get('http://oh.sia.fp2WM5WvNEVHZogvpLOA1xGybZvtHYoOG0fdnm7cALmWptLRHpDUjo2LtcIBS9Xtd2Pgvx95WZZQRuXCdhMrQ@openhab.ubiquarium.fr/rest/items/IndoorNetatmo02_Co2')
            .then(function (response) {
                return response.data.state
            })

    },
    getTemperature: function (){
        return axios.get('http://oh.sia.fp2WM5WvNEVHZogvpLOA1xGybZvtHYoOG0fdnm7cALmWptLRHpDUjo2LtcIBS9Xtd2Pgvx95WZZQRuXCdhMrQ@openhab.ubiquarium.fr/rest/items/MultiSensor02_Temperature')
            .then(function (response) {
                return response.data.state
            })
    },
    getHumidity: async function (){
        return axios.get('http://oh.sia.fp2WM5WvNEVHZogvpLOA1xGybZvtHYoOG0fdnm7cALmWptLRHpDUjo2LtcIBS9Xtd2Pgvx95WZZQRuXCdhMrQ@openhab.ubiquarium.fr/rest/items/MultiSensor02_Humidity')
            .then(function (response) {
                return response.data.state
            })
    }
};






// queryApi.queryRows(fluxQuery, {
//     next(row, tableMeta) {
//         const o = tableMeta.toObject(row)
//         // console.log(JSON.stringify(o, null, 2))
//         console.log(
//             `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
//         )
//     },
//     error(error) {
//         console.error(error)
//         console.log('\nFinished ERROR')
//     },
//     complete() {
//         console.log('\nFinished SUCCESS')
//     },
// })