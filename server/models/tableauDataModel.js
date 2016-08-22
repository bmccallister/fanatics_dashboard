var uuid = require("uuid");
var config = require("../config");
var couchbase = require('couchbase');
var db = (new couchbase.Cluster(config.couchbase.server));
var tableauData = db.openBucket('tableau_data');
var tableauComponents = db.openBucket('tableau_components');

var N1qlQuery = require('couchbase').N1qlQuery;
 
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
    tableauData.upsert(documentId, jsonObject, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {message: "success", data: result});
    });
}

TableauDataModel.updatePayloadData = function(jsonString, callback) {
    var keyVal = Obj.keys(jsonString)[0];
    console.log('Key val in upload payload data:', keyVal);
    callback('ok');
    return;
};


TableauDataModel.getComponentData = function(component, callback) {
    console.log('Getting component data:', component);
    var statement = "SELECT * " +
                "FROM `" + config.couchbase.data + "` where component=$1";
    var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    console.log('Query:', query, component);
    tableauData.query(query, [component], function(error, result) {
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
    tableauData.query(query, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

module.exports = TableauDataModel;