var uuid = require("uuid");
var _ = require('lodash');
var config = require("../../server/config");
var couchbase = require('couchbase');
var db = (new couchbase.Cluster(config.couchbase.server));
var tableauData = db.openBucket('tableau_data');
var tableauComponents = db.openBucket('tableau_components');
var N1qlQuery = couchbase.N1qlQuery;
 
function TableauDataModel() { };

TableauDataModel.save = function(data, callback) {
    var jsonObject = {
        load: data.load,
        averageResponse: data.averageResponse,
        peakConcurrent: data.peakConcurrent,
        hitsLastHour: data.hitsLastHour,
        systemHealth: data.systemHealth
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

var buildSet = function(qObject) {
    var query = ' SET ';
    console.log('Building set from:', qObject);

    console.log('Payload:', qObject.payload);
    var payloadArray = Object.keys(qObject.payload);
    for (var i = 0 ; i<payloadArray.length ; i++) {
        if (i>0) {
            query += ', ';
        }
        var key = payloadArray[i];
        console.log('Key:', key);
        query += 'payload.' + key + '=' + '\"' + qObject.payload[key] + '\"';
        console.log('Query:', query);
    }
    return query;
}

var buildWhere = function(qObject) {
    var query = ' WHERE ';
    console.log('Building where');
    var key = Object.keys(qObject)[0];
    console.log('My key:', key);
    var val = qObject[key];
    query += key + '=\"' + val + '\";';
    return query;
}

TableauDataModel.updatePayloadData = function(jsonObj, callback) {
    try {
        if (typeof(jsonObj)=='string') {
            console.log('parsing string:' + jsonObj);
            var newObj = JSON.parse(jsonObj);
            jsonObj = newObj;
        }
        var statement = "update " + config.couchbase.data;
        statement += buildSet(jsonObj);
        statement += buildWhere(jsonObj);
        console.log('n1ql statement:' + statement)
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        tableauData.query(query, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
        return;
    } catch (exc) {
        console.log('Error converting value to json:', jsonObj);
        callback(null, undefined);
    }
};


TableauDataModel.getComponentData = function(component, callback) {
    var statement = "SELECT * " +
                "FROM `" + config.couchbase.data + "` where component=$1";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    console.log('Query:', query, component);
    db.query(query, [component], function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

TableauDataModel.getAll = function(callback) {
    var statement = "SELECT * " +
                    "FROM `" + config.couchbase.data + "`";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    db.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

module.exports = TableauDataModel;