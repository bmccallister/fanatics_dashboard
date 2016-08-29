"use strict"; 

class ComponentModel {
    constructor(name, title, description, interval, apiInterval, values) 
    {
        this.name = name,
        this.title = title,
        this.description = description,
        this.interval = interval,
        this.apiInterval = apiInterval,
        this.values = values
    }
};

module.exports = ComponentModel;