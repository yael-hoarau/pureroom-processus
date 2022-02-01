const requests = require("./openhab_requests");

async function getValues(){
    return Promise.all([
        requests.getHumidity(),
        requests.getTemperature(),
        requests.getCO2(),
    ]).then(([ humidity, temperature, co2 ]) => {
        return [humidity, temperature, co2]
    })
}


function getDewPoint(humidity, temperature){
    return (temperature - (100 - humidity)/5)
}
function getDewPointScore(humidity, temperature){
    return dew_point_status(getDewPoint(humidity, temperature)).score
}

function getHumidexScore(humidity, temperature, dewPoint){
    return humidex_status( parseInt(temperature) + 5/9*(6.11 * Math.pow(2.71828, (5417.7530*(1/273.16 - 1/(273.15+parseInt(dewPoint)))))))
        .score
}

function getHeatIndexScore(humidity, temperature){
    let c = [
        -8.78469475556,
        1.61139411,
        2.33854883889,
        -0.14611605,
        -0.012308094,
        -0.0164248277778,
        0.002211732,
        0.00072546,
        -0.000003582,
    ]
    return heat_index_status( c[0] +
        c[1] * temperature +
        c[2] * humidity +
        c[3] * temperature * humidity +
        c[4] * Math.pow(temperature, 2) +
        c[5] * Math.pow(humidity, 2) +
        c[6] * Math.pow(temperature, 2) * humidity +
        c[7] * temperature * Math.pow(humidity, 2) +
        c[8] * Math.pow(temperature, 2) * Math.pow(humidity, 2)).score
}

function getCo2Score(co2){
    return indoor_co2_status(co2).score;
}

const dew_point_status = (dew_point_value) => {
    if(dew_point_value < 5) return {code: 0, value: "very dry", score: 30}
    else if(dew_point_value >= 5 && dew_point_value < 10 ) return {code: 1, value: "dry", score: 60}
    else if(dew_point_value >= 10 && dew_point_value < 15 ) return {code: 2, value: "confortable", score: 100}
    else if(dew_point_value >= 15 && dew_point_value < 24 ) return {code: 3, value: "begin muggy", score: 60}
    else if(dew_point_value >= 20 && dew_point_value < 24 ) return {code: 4, value: "muggy", score: 30}
    else return {code: 5, value: "uncomfortable", score: 0}
}

const humidex_status = (humidex_value) => {
    if(humidex_value < 15) return {code: 0, value: "fresh", score: 80}
    else if(humidex_value >= 5 && humidex_value < 10 ) return {code: 1, value: "dry", score: 90}
    else if(humidex_value >= 15 && humidex_value < 29 ) return {code: 2, value: "confortable", score: 100}
    else if(humidex_value >= 30 && humidex_value < 39 ) return {code: 3, value: "uncomfortable", score: 20}
    else if(humidex_value >= 40 && humidex_value < 53 ) return {code: 4, value: "danger", score: 10}
    else return {code: 5, value: "extreme", score: 0}
}

const heat_index_status = (heat_index_value) => {
    if(heat_index_value < 26) return {code: 0, value: "confortable", score: 100}
    else if(heat_index_value >= 26 && heat_index_value < 31 ) return {code: 1, value: "caution", score: 20}
    else if(heat_index_value >= 31 && heat_index_value < 51 ) return {code: 2, value: "uncomfortable", score: 10}
    else return {code: 3, value: "danger", score: 0}
}

const indoor_co2_status = (indoor_co2_value) => {
    if(indoor_co2_value < 600) return {code: 0, value: "excellent", score: 100}
    else if(indoor_co2_value >= 600 && indoor_co2_value < 1000 ) return {code: 1, value: "confortable", score: 90}
    else if(indoor_co2_value >= 1000 && indoor_co2_value < 1500 ) return {code: 2, value: "unconfortable", score: 10}
    else return {code: 3, value: "danger", score: 0}
}

module.exports = {
    getScore: async function () {
        const values = await getValues();

        const humidity = values[0]
        const temperature = values[1].split(' ')[0]
        const co2 = values[2].split(' ')[0]

        const dewPoint = getDewPoint(humidity, temperature)
        const dewPointScore = getDewPointScore(humidity, temperature)
        const humidexScore = getHumidexScore(parseInt(humidity), parseInt(temperature), parseInt(dewPoint))
        const heatIndexScore = getHeatIndexScore(parseInt(humidity), parseInt(temperature))
        const co2Score = getCo2Score(co2)

        const finalScore = (parseInt(dewPointScore) + parseInt(humidexScore) + parseInt(heatIndexScore) + parseInt(co2Score))/4

        // console.log("Humidity : " + humidity)
        // console.log("Temperature : " + temperature)
        // console.log("Dew Point : " + dewPointScore)
        // console.log("Humidex : " + humidexScore)
        // console.log("Heat Index : " + heatIndexScore)
        // console.log("CO2 : " + co2Score)
        //
        // console.log("Score : " + finalScore);

        return finalScore;
    }
}