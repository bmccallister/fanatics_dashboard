"use strict";

const uuid = require("uuid");
const config = require("../config");
const couchbase = require('couchbase');
const db = (new couchbase.Cluster(config.couchbase.server));
const componentData = db.openBucket('tableau_data');
const N1qlQuery = require('couchbase').N1qlQuery;

class ComponentDataService {

   static save (componentDataModel, callback)  {
        const documentId = data.document_id ? data.document_id : uuid.v4();
        componentData.upsert(documentId, componentDataModel, function(error, result) 
        {
            if (error) 
            {
                callback(error, null);
                return;
            }

            callback(null, {message: "success", data: result});
        });
    }


    static getAll (callback) {
        var statement = "SELECT * FROM `" + config.couchbase.data + "`";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        componentData.query(query, function(error, result) 
        {
            if(error) 
            {
                return callback(error, null);
            }

            callback(null, result);
        });
    }

    static getActiveInterfaces (callback) {
        var statement = "SELECT * FROM `" + config.couchbase.data + "`";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        componentData.query(query, function(error, result) 
        {
            if(error) 
            {
                return callback(error, null);
            }

            callback(null, result);
        });
    }
}

module.exports = ComponentDataService;