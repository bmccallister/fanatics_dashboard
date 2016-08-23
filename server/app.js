var i = 0;
console.log('here:' + i++);
// Includes
////////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
console.log('here:' + i++);
const http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888,
    app = express();
    console.log('here:' + i++);
const bodyParser = require("body-parser");
const router = express.Router();

console.log('here:' + i++);
// Middleware
////////////////////////////////////////////////////////////////////////////////////////////////////////
const myLogger = (req, res, next) => {
  console.log('Request:', req);
  next();
};
console.log('here:' + i++);
const passThrough = (req,res,next) => {
  const uri = url.parse(req.url).pathname
    , filename = path.join(path.join(process.cwd(),'../frontend/pages'), uri);
    
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
console.log('here:' + i++);
// App initialization
////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log('initializing');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dataAccess = require('./routes/dataAccess');
console.log('calling initialize in router');
dataAccess.initialize(router);

app.use(myLogger);
app.use('/api', router);
app.use(passThrough);
app.listen(port);

