"use strict";

class ComponentDataModel {
    constructor(load, averageResponse, peakConcurrent, hitsLastHour, systemHealth) 
    {
        this.load = load,
        this.averageResponse = averageResponse,
        this.peakConcurrent = peakConcurrent,
        this.hitsLastHour = hitsLastHour,
        this.systemHealth = systemHealth
    }
}

module.exports = ComponentDataModel;