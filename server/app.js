var express = require('express');

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888,
    app = express();
var bodyParser = require("body-parser");

var config = require("./config");
var couchbase = require("couchbase");
var router = express.Router();



var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};



var passThrough = function(req,res,next) {
  var uri = url.parse(req.url).pathname
    , filename = path.join(path.join(process.cwd(),'../frontend/pages'), uri);
    
  console.log('have path:', path)
  fs.exists(filename, function(exists) {
    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write(err + "\n");
        res.end();
        return;
      }

      res.writeHead(200);
      res.write(file, "binary");
      res.end();
    });
  });
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var bucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);
console.log('my bucket:', bucket );
app.bucket = module.exports.bucket = bucket;

var dataAccess = require('./routes/dataAccess');
dataAccess.initialize(router);
app.use(myLogger);
app.use('/api', router);
app.use(passThrough);
app.listen(8888);

