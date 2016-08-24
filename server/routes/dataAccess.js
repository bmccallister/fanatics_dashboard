
const _ = require('lodash');
console.log('Requiring component model in dataAccess');
const componentModel = require("../models/componentModel");
console.log('Requiring data model in dataAccess');
const DataModel = require("../models/tableauDataModel");


const initialize = (router) => {
    console.log('inside the router')
    router.use('/test', function(req,res,next) {
      res.send('test ok');
    })
    console.log('setting up routes');
    router.use('/tableau_components/:component', (req,res,next) => {
            var component = req.params.component;
            console.log('i have datamodel:', DataModel);
            DataModel.getComponentData(req.params.component, (error, results) => {
                if (error) {
                    res.status(400).send(error);
                    return;
                }
                try {
                    var resObj = results[0]
                    var retVal = resObj[Object.keys(resObj)[0]];
                    res.json(retVal);
                } catch (exception) {
                    res.status(400).send(exception);
                }
            })
    })
    
    router.use('/tableau_components', (req,res,next) => { 
        componentModel.getAll(function(error, results) {
            if (error) {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        })
    })
}


module.exports = {
    initialize: initialize
}