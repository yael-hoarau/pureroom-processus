const cron = require('node-cron');
const {postNb} = require("./openhab_requests");
const sqlite = require('./db')
const {getScore} = require("./score");

module.exports = {
    launchCron: function () {
        let score = 0;
        let up = true;
        cron.schedule('0 */5 * * * *', function() {
            // if(score >= 100)
            //     up = false
            // else if(score <= 0)
            //     up = true;
            // score += up ? 5 : -5;
            getScore().then(function (score) {
                var datetime = new Date();
                console.log(datetime);
                console.log('Score : ' + score);
                postNb(score);
                const db = sqlite.openReadWrite();
                sqlite.insertScore(db, score);
                sqlite.close(db);
            });
        });
    }
}