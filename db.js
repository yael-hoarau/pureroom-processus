const sqlite3 = require('sqlite3').verbose();

module.exports = {
    openReadOnly: function (){
        let db = new sqlite3.Database('./db/pureroom.db', sqlite3.OPEN_READONLY,  (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the pureroom database.');
        });
        return db;
    },

    openReadWrite : function (){
        let db = new sqlite3.Database('./db/pureroom.db', sqlite3.OPEN_READWRITE,  (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the pureroom database.');
        });
        return db;
    },

    close: function(db){
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    },

    insertScore: function (db, value){
        const sqllite_date = Math.floor(new Date().getTime() / 1000);
        //console.log(sqllite_date);
        db.run(`INSERT INTO score(value, time) VALUES(?, ?)`, [value, sqllite_date], function(err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    },

    selectScoreFrom: function(db, timestamp){
        let sql = `SELECT * FROM score WHERE time > ?`;

        return new Promise((resolve, reject) => {
            let result = []
            db.each(sql, [timestamp], (err, row) => {
                if(err) { reject(err) }
                result.push(row)
                //console.log(row)
            }, () => {
                resolve(result)
            })

        })
    }
}

// db.run('CREATE TABLE score (' +
//     ' id INTEGER PRIMARY KEY,' +
//     ' value INTEGER NOT NULL,' +
//     ' time INTEGER NOT NULL' +
//     ');');

