"use strict";

// Includes
////////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const url = require("url");
const path = require("path");
const fs = require("fs");
const port = process.argv[2] || 8888;
const app = express();

const http = require("http").createServer(app);

const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const router = express.Router();

const routeManager = require('./managers/routeManager');
routeManager.initialize(router);

const socketManager = require('./managers/socketManager');
socketManager.initialize(io);

// Middleware
////////////////////////////////////////////////////////////////////////////////////////////////////////
const myLogger = (req, res, next) => {
  //console.log('Request:', req);
  next();
};
const sendFile = (filename, res) => {
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
  return;
}

const passThrough = (req,res,next) => {
  let uri = url.parse(req.url).pathname;
  let filename = path.join(path.join(process.cwd(),'../frontend/pages'), uri);
  console.log('Request for file is: ', filename);
  if (filename.indexOf('.')<0) {
      uri = 'index.html';
      filename = path.join(path.join(process.cwd(),'../frontend/pages'), uri);
      console.log('No period, forcing file out:', filename);
      sendFile(filename, res);
      return;
  }
  fs.exists(filename, function(exists) {
    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }

    sendFile(filename, res);
  });
}

// App initialization
////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log('initializing');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(myLogger);
app.use('/api', router);
app.use(passThrough);
http.listen(port);
console.log('Listening on port:', port);
