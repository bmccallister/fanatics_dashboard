"use strict";

const uuid = require("uuid");
const config = require("../config");
const couchbase = require('couchbase');
const db = (new couchbase.Cluster(config.couchbase.server));
const components = db.openBucket('components');
const N1qlQuery = require('couchbase').N1qlQuery;

class componentService {
   static createComponent (componentModel, callback)  {
        const documentId = componentModel.document_id ? componentModel.document_id : uuid.v4();
        console.log('Creating component from id:', documentId, componentModel);
        components.upsert(documentId, componentModel, function(error, result) 
        {
            if (error) 
            {
                callback(error, null);
                return;
            }

            callback(null, {message: "success", data: result});
        });
    }
    static deleteComponentByName (name, callback) {
        const statement = "DELETE FROM `" + config.couchbase.components + "` where id=$1";
        const query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        console.log('Running query:', query, name);
        components.query(query, [name], function(error, result) {
            if(error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    }

    static updateComponent (id, payload, callback) {
        console.log('In update component');
        components.replace(id, payload, function(error, result) {
            if(error) {
                console.log('got error:', error, id, payload);
                callback(error, null);
                return;
            }
            callback(null, {message: "success", data: result});
        });
    }
    static getComponentByID (id, callback) {
        //console.log('API Server: Retrieving all components by id.');
        let statement = "SELECT * FROM `" + config.couchbase.components + "` where id=$1";
        let query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        
        components.query(query, [id], function(error, result) 
        {
            if (error) 
            {
                return callback(error, null);
            }
            
            callback(null, result);
        });
    }

    static getComponentsByContext (context, callback) {
        //console.log("API Server: Retrieving all components by context: " + context);
        var statement = "SELECT * FROM `" + config.couchbase.components + "` where context='" + context + "'";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        components.query(query, function(error, result) 
        {
            if(error) 
            {
                return callback(error, null);
            }

            callback(null, result);
        });
    }

    static getComponentsByTemplate (template, callback) {
        //console.log('API Server: Retrieving all components by template.');
        var statement = "SELECT * FROM `" + config.couchbase.components + "` where template=$1";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        components.query(query, function(error, result) 
        {
            if(error) 
            {
                return callback(error, null);
            }

            callback(null, result);
        });
    }

    static getComponentsByTemplateContext (template, context, callback) {
        //console.log('API Server: Retrieving all components by template and context.');
        var statement = "SELECT * FROM `" + config.couchbase.components + "` where template=$1 AND context=$2";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        components.query(query, function(error, result) 
        {
            if(error) 
            {
                return callback(error, null);
            }

            callback(null, result);
        });
    }

    static getAll (callback) {
        //console.log('API Server: Retrieving all components.');
        var statement = "SELECT * FROM `" + config.couchbase.components + "`";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        components.query(query, function(error, result) 
        {
            
            if(error) 
            {
                return callback(error, null);
            }

            callback(null, result);
            
        });
    }

    static getDistinctContexts (callback) {
        var statement = "SELECT context, COUNT(*) as count FROM `" + config.couchbase.components + "` GROUP BY context";
        var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
        components.query(query, function(error, result) 
        {
            if(error) 
            {
                return callback(error, null);
            }

            callback(null, result);
        });
    }
}

module.exports = componentService;