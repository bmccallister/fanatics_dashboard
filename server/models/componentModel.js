"use strict";

class ComponentModel {
    constructor(id, template, context, payload, type, lastModified) 
    {
        this.id = id,
        this.template = template,
        this.context = context,
        this.payload = payload,
        this.type = type,
        this.lastModified = lastModfied
    }
}

module.exports = ComponentModel;