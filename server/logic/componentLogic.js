"use strict";

const _ = require('lodash');
const componentService = require("../services/componentService");

class ComponentService {

    static getAllComponents(req, res)
    {
        componentService.getAll(function(error, results) 
        {
            if (error) 
            {
                res.status(400).send(error);
                return;
            }
            res.json(results);
        });
    }

}

module.exports = ComponentService;