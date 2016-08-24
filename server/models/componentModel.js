const uuid = require("uuid");
const config = require("../config");
const couchbase = require('couchbase');
const db = (new couchbase.Cluster(config.couchbase.server));
const tableauData = db.openBucket('tableau_data');
const tableauComponents = db.openBucket('tableau_components');
const N1qlQuery = require('couchbase').N1qlQuery;
 

 class ComponentModel {
    constructor() {
        this.schemaObject = {
          "name": "unset_device",
          "title": "Unset",
          "description": "Unset",
          "interval": "1000",
          "apiInterval": 1000,
          "acceptPush": true,
          "values": []
        }
    }
    static save (data, callback)  {
        var jsonObject = {
            name: data.name,
            city: data.city,
            upc: data.upc
        }
        const documentId = data.document_id ? data.document_id : uuid.v4();
        tableauComponents.upsert(documentId, jsonObject, function(error, result) {
            if(error) {
                callback(error, null);
                return;
            }
            callback(null, {message: "success", data: result});
        });
    }
    static getAll (callback) {
        const statement = "SELECT * " +
                        "FROM `" + config.couchbase.components + "` AS components";
        const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        tableauComponents.query(query, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    };
    static getComponentByName (name, callback) {
        const statement = "SELECT * " +
                        "FROM `" + config.couchbase.data + "` where component=$1";
        const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        console.log('Query:', query, name);
        tableauComponents.query(query, [name], function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    }
};


module.exports = ComponentModel;