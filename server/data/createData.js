var config = require("../../server/config");
var _ = require('lodash');
var couchbase = require("couchbase");
var sampleData = require('./sampleData');
var db = (new couchbase.Cluster(config.couchbase.server));
var tableauData = db.openBucket('tableau_data');
var tableauComponents = db.openBucket('tableau_components');


var processNext = function(obj, i, arr, key) {
    return new Promise(function( resolve, reject) {
        if (i >=  arr.length) {
            resolve(true);    
        } else {
            console.log('My object:' + i);
            console.log('Upserting:',  arr[i])
            upsert(obj, arr[i], key).then(function(data) {
                console.log('Upsert completed');
                i++;
                resolve(i);
            })
            
        }
    });
}
var remainingComponents = 0;

var processAll = function(obj, arr, key, cb) {
    if (remainingComponents<arr.length) {
        processNext(obj, remainingComponents, arr, key).then(function(data) {
            console.log('Process next returned remaining count:' + data);
            remainingComponents = data;
            processAll(obj, arr, key, cb);
        })
    } else {
        console.log('All components processed!');
        cb();
    }
}

var upsert = function(obj, data, key) {
    console.log('Creating promise against data:' ,data);
    return new Promise(function( resolve, reject) {
        console.log('Using key:' + key)
        console.log('Performing upsert at ' + data[key]);
        obj.upsert(data[key], data, function(err, result) {
            console.log('Upsert completed');
          if (err) {
              console.log('Caught error in upsert!');
              console.log(err);
              process.exit(0);
          }
          obj.get(data[key], function(err, result) {
               if (err) {
                  console.log('Caught error in get!');
                  console.log(err);
                  process.exit(0);
              }
             console.log('Succsess:', result.value);
            resolve()
            // {name: Frank}
          });
        });
    });
}

processAll(tableauComponents, sampleData.tableauComponents, 'name', function() {
    console.log('Tableau Components created, resetting counter and beginning data');
    remainingComponents = 0;
    processAll(tableauData, sampleData.tableauData, 'id', function() {
        console.log('All tableau data created, exiting');
        process.exit(0)
    });
});