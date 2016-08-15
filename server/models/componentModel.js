var uuid = require("uuid");
var db = require("../app").bucket;
var config = require("../config");
var N1qlQuery = require('couchbase').N1qlQuery;
 
function ComponentModel() { };

ComponentModel.save = function(data, callback) {
    var jsonObject = {
        bane: data.name,
        city: data.city,
        upc: data.upc
    }
    var documentId = data.document_id ? data.document_id : uuid.v4();
    db.upsert(documentId, jsonObject, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {message: "success", data: result});
    });
}
ComponentModel.getComponentByName = function(name, callback) {
    var statement = "SELECT * " +
                    "FROM `" + config.couchbase.data + "` where component=$1";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    console.log('Query:', query, name);
    db.query(query, [name], function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
}

ComponentModel.getAll = function(callback) {
    var statement = "SELECT * " +
                    "FROM `" + config.couchbase.components + "` AS components";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

module.exports = ComponentModel;