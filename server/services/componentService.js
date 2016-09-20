"use strict";

const uuid = require("uuid");
const config = require("../config");
const couchbase = require('couchbase');
const db = (new couchbase.Cluster(config.couchbase.server));
const components = db.openBucket('tableau_components');
const N1qlQuery = require('couchbase').N1qlQuery;

const componentModel = require("../models/componentModel");

class ComponentService {

   static save (componentModel, callback)  {
        const documentId = data.document_id ? data.document_id : uuid.v4();
        components.upsert(documentId, componentModel, function(error, result) {
            if(error) {
                callback(error, null);
                return;
            }
            callback(null, {message: "success", data: result});
        });
    }
    static getComponentDataByName (name, callback) {
        let statement = "SELECT * FROM `" + config.couchbase.components + "` where name=$1";
        let query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        console.log(query, name);
        components.query(query, [name], function(error, result) 
        {
            if (error) 
            {
                return callback(error, null);
            }
            
            callback(null, result);
        });
    }

    static getAll (callback) {
        const statement = "SELECT * FROM `" + config.couchbase.components + "` AS components";
        const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        components.query(query, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    };

    static getComponentByName (name, callback) {
        const statement = "SELECT * FROM `" + config.couchbase.data + "` where component=$1";
        const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        
        components.query(query, [name], function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    }
};
 
module.exports = ComponentService;