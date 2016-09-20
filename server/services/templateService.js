"use strict";

const uuid = require("uuid");
const config = require("../config");
const couchbase = require('couchbase');
const db = (new couchbase.Cluster(config.couchbase.server));
const templates = db.openBucket('templates');
const N1qlQuery = require('couchbase').N1qlQuery;

const templateModel = require("../models/templateModel");

class TemplateService {

   static save (templateModel, callback)  {
        const documentId = data.document_id ? data.document_id : uuid.v4();
        templates.upsert(documentId, templateModel, function(error, result) {
            if(error) {
                callback(error, null);
                return;
            }
            callback(null, {message: "success", data: result});
        });
    }

    static getAll (callback) {
        const statement = "SELECT * FROM `" + config.couchbase.templates + "`";
        const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        templates.query(query, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    };

    static getTemplateByName (name, callback) {
        const statement = "SELECT * FROM `" + config.couchbase.templates + "` where name=$1";
        const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        
        templates.query(query, [name], function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    }
};
 
module.exports = TemplateService;