let path = require('path');
let sqlite3 = require('sqlite3').verbose();
let dbFileName = 'user.sqlite';
let TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
let db;

function setDB(){
    if(db == undefined){
        let dbPath = dbFileName;
        dbPath  = path.resolve(__dirname + "/../",dbFileName);
        db = new TransactionDatabase(
            new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
        );
    }
}

function getDBConnection() {
    return db;
}

let execQuery = async function(query, db) {
    try {
      let queryParam = query.split(' ');
      if (queryParam[0].trim().toLowerCase() == "select")
        return await asyncSelectQuery(query, db);
      else if (queryParam[0].trim().toLowerCase() == "insert")
        return await asyncInsertQuery(query, db);
      else if (queryParam[0].trim().toLowerCase() == "update" || queryParam[0].trim().toLowerCase() == "delete")
        return await asyncUpdateQuery(query, db);
      else
        return await asyncSelectQuery(query, db);
    } catch (ex) {
      console.log(ex);
      console.log("Error in query", query);
      throw "Error in query query = " + query + " error =" + ex;
    }
}

let asyncSelectQuery = function(query, db) {
    return new Promise(function(resolve, reject) {
        db.all(query, function(err, result) {
            if (err) {
                reject(err);
            }
            resolve({
                status: true,
                data: result
            })
        });
    });
}
  
let asyncInsertQuery = function(query, db) {
    return new Promise(function(resolve, reject) {
        db.run(query, function(err, result) {
            if (err) {
                reject(err);
            }
            resolve({
                status: true,
                data: this.lastID
            })
        });
    });
}
  
let asyncUpdateQuery = function(query, db) {
    return new Promise(function(resolve, reject) {
        db.run(query, function(err, result) {
            if (err) {
                reject(err);
            }
            resolve({
                status: true
            })
      });
    });
}

module.exports = {
    setDB: setDB,
    getDBConnection: getDBConnection,
    execQuery: execQuery
}