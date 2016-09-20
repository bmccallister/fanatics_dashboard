"use strict"; 

class TemplateModel {
    constructor(name, title, description, apiInterval, acceptPush, dataDefinition) 
    {
        this.name = name,
        this.title = title,
        this.description = description,
        this.apiInterval = apiInterval,
        this.acceptPush = acceptPush,
        this.dataDefinition = dataDefinition
    }
};

module.exports = TemplateModel;