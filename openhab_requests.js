const axios = require("axios");

let config1 = {
    headers: {
        'Content-Length': 20,
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
        'Content-Length': 20,
        'Content-Type': 'text/plain'
    },
    responseType: 'text'
};

let sensor_co2_list = require("./sensor_co2.json")
let sensor_temperature_list = require("./sensor_temperature.json")
let sensor_humidity_list = require("./sensor_humidity.json")

module.exports = {
    //ACTUATOR
    postOFF: function(){
        axios.post(`${process.env.OPENHAB_REST_ITEM}/LightRGBTradfri02_Color_Temperature`, '(0,100,100)', config1)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    postON: function(){
        axios.post(`${process.env.OPENHAB_REST_ITEM}/LightRGBTradfri02_Color_Temperature`, '(100, 100, 100)', config3)
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
        //axios.post('http://oh.sia.fp2WM5WvNEVHZogvpLOA1xGybZvtHYoOG0fdnm7cALmWptLRHpDUjo2LtcIBS9Xtd2Pgvx95WZZQRuXCdhMrQ@openhab.ubiquarium.fr/rest/items/LightRGBTradfri02_Color_Temperature', nb, config)
        axios.post(`${process.env.OPENHAB_REST_ITEM}/LightRGBTradfri02_Color_Temperature`, nb, config)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    //SENSOR
    getCO2: function (){
        return new Promise((resolve, reject)=>{
            this.getWeather('co2').then(res=>{resolve(res)}).catch(err=>{reject(err)})
        })
    },
    getTemperature: function (){
        return new Promise((resolve, reject)=>{
            this.getWeather('temperature').then(res=>{resolve(res)}).catch(err=>{reject(err)})
        })
    },
    getHumidity: function (){
        return new Promise((resolve, reject)=>{
            this.getWeather('humidity').then(res=>{resolve(res)}).catch(err=>{reject(err)})
        })
    },
    getWeather: function(type){
        return new Promise(async (resolve, reject)=>{
            try{
                let list
                let sum = 0

                switch (type){
                    case 'co2': list = [...sensor_co2_list]; break
                    case 'temperature': list = [...sensor_temperature_list]; break
                    case 'humidity': list = [...sensor_humidity_list]; break
                    default: return new Error('missmatch type')
                }

                for(let sensor of list) {
                    await axios.get(`${process.env.OPENHAB_REST_ITEM}/${sensor.name}`)
                        .then(function (response) {
                            sum+=parseFloat(response.data.state.split(' ')[0])
                        })
                        .catch(err=>{
                            reject(err)
                        })
                }
                resolve(sum/list.length)
            }catch (err){
                reject(err)
            }
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