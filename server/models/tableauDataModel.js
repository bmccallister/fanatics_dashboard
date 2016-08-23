"use strict";

const uuid = require("uuid");
const config = require("../config");
const couchbase = require('couchbase');
const db = (new couchbase.Cluster(config.couchbase.server));
const tableauData = db.openBucket('tableau_data');
const tableauComponents = db.openBucket('tableau_components');
const N1qlQuery = require('couchbase').N1qlQuery;

class TableauDataModel {
    constructor() {
        this.schemaObject = {
            load: 0,
            averageResponse: 0,
            peakConcurrent: 0,
            hitsLastHour: 0,
            systemHealth: '100%'
        };
    }
    getComponentData (component, callback) {
        let statement = "SELECT * " +
                    "FROM `" + config.couchbase.data + "` where component=$1";
        let query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        console.log('Query:', query, component);
        tableauData.query(query, [component], function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    }
    getAll (callback) {
        var statement = "SELECT * " +
                        "FROM `" + config.couchbase.data + "`";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        tableauData.query(query, function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    }
}

module.exports = TableauDataModel;