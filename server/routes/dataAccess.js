var _ = require('lodash');

var componentModel = require("../models/componentModel");
var DataModel = require("../models/tableauDataModel");

var initialize = function(router) {
    router.use('/test', function(req,res,next) {
      res.send('test ok');
      console.log('Hit api test');
    })
    
    router.use('/user/:userid', function(req,res,next) {
        var userId = req.params.userid;
        if (userId) {
            var idInt = parseInt(userId, 10);
            if (!_.isUndefined(idInt)&&_.isNumber(idInt)) {
                res.json(someData[idInt]);
                return;
            }
        }
        
        res.send('No valid user specified');
        return;
    });
    
    router.use('/tableau_components/:component', function(req,res,next) {
            console.log('Finding data by component:' + req.params.component);
            var component = req.params.component;
            DataModel.getComponentData(req.params.component, function(error, results) {
                if (error) {
                    res.status(400).send(error);
                    return;
                }
                try {
                    console.log('Got component data!');
                    var resObj = results[0]
                    var retVal = resObj[Object.keys(resObj)[0]];
                    console.log('retval:', retVal);
                    res.json(retVal);
                } catch (exception) {
                    res.status(400).send(exception);
                }
            })
    })
    
    router.use('/tableau_components', function(req,res,next) {
        componentModel.getAll(function(error, results) {
            if (error) {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        })
    })
    
    // Must be int val
  
}


module.exports = {
    initialize: initialize
}