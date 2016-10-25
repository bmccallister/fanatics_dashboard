module.exports.sampleTemplate = {
  "name": "sample_template",
  "title":"Sample sampleTemplate",
  "description": "Your Sample Template",
  "acceptPush": false,
  "dataDefinition": [
    {
      "name": "Some Field",
      "threshold": [],
      "key": "someField"
    },
    {
      "name": "Another Field",
      "threshold": [
        "0",
        "3",
        "5"
      ],
      "key": "anotherField"
    },
    {
      "name": "Third Field",
      "threshold": [],
      "key": "thirdField"
    },
    {
      "name": "Fourth Field",
      "threshold": [
        "0%",
        "5%",
        "100%"
      ],
      "key": "fourthField"
    },
    {
      "name": "Fifth Field",
      "threshold": [
        "10%",
        "7%",
        "3%",
        "0%"
      ],
      "key": "fifthField"
    }
  ],
  "thresholdFields": [
    "fourthField",
    "fifthField"
  ],
  "module": "sample_template"
}

module.exports.templates = [
{
  "name": "tcs_load",
  "title": "TCS Load",
  "description":"TCS Load Monitoring",
  "apiInterval": 1000,
  "acceptPush": false,
  "dataDefinition": [
    {
      "name": "Load",
      "threshold": [],
      "key": "load"
    },
    {
      "name": "Response Time",
      "threshold": [
        "0",
        "3",
        "5",
        "1000"
      ],
      "key": "averageResponse"
    },
    {
      "name": "Max Conc.",
      "threshold": [],
      "key": "peakConcurrent"
    },
    {
      "name": "Hits (1 hr)",
      "threshold": [],
      "key": "lastHour"
    },
    {
      "name": "System Health",
      "threshold": [
        "100%",
        "90%",
        "80%",
        "0%"
      ],
      "key": "systemHealth"
    }
  ],  
  "charts": [
    "tree",
    "bargraph",
    "pie"
  ],
  "thresholdFields": [
    "averageResponse"
  ]
},
{
  "name": "tcs_orders",
  "title":"TCS Orders",
  "description": "TCS Order Monitoring",
  "acceptPush": false,
  "dataDefinition": [
    {
      "name": "Total Orders",
      "threshold": [],
      "key": "orders"
    },
    {
      "name": "Fulfilled Orders",
      "threshold": [
        "0",
        "3",
        "5"
      ],
      "key": "fulfilledOrders"
    },
    {
      "name": "Abandoned Orders",
      "threshold": [],
      "key": "abandonedOrders"
    },
    {
      "name": "Stuck Orders",
      "threshold": [
        "0%",
        "5%",
        "100%"
      ],
      "key": "stuckOrders"
    },
    {
      "name": "Conversion Rate ",
      "threshold": [
        "10%",
        "7%",
        "3%",
        "0%"
      ],
      "key": "conversionRate"
    }
  ],
  "thresholdFields": [
    "abandonedOrders",
    "conversionRate"
  ],
  "charts": [
    "tree",
    "bargraph",
    "pie"
  ],
  "module": "tcs_orders"
},
{
  "name": "return_dispositions",
  "title":"Return Dispositions",
  "description": "Most used return dispositions.",
  "acceptPush": false,
  "dataDefinition": [
    {
      "name": "Wrong Size",
      "threshold": [
        "0",
        "20",
        "50"
      ],
      "key": "wrong_size"
    },
    {
      "name": "Incorrect product shipped",
      "threshold": [
        "0",
        "20",
        "50"
      ],
      "key": "incorrect_product_shipped"
    },
    {
      "name": "Product damaged",
      "threshold": [
        "0",
        "20",
        "50"
      ],
      "key": "product_damaged"
    },
    {
      "name": "Incorrect customization",
      "threshold": [
        "0",
        "20",
        "50"
      ],
      "key": "incorrect_customization"
    },
    
  ],
  "thresholdFields": [
    "wrong_size",
    "incorrect_product_shipped",
	"product_damaged",
	"incorrect_customization"
  ],
  "charts": [
    "tree",
    "gauge"
  ],
  "module": "return_dispositions"
}

];

module.exports.components = [
{
  "context": "dev",
  "id": "tcs_load1",
  "name": "TCS Load Monitoring",
  "lastModified": "1470669993",
  "payload": {
    "abandonedOrders": "15",
    "conversionRate": "6",
    "fulfilledOrders": "400",
    "orders": "545",
    "stuckOrders": "30"
  },
  "template": "tcs_load",
  "type": "pie",
  "charts": [
    "pie",
    "bargraph",
    "tree",
    "heatmap"
  ]
},
{
  "id": "tcs_orders_1",
  "template": "tcs_orders",
  "context":"development",
  "payload": {
    "orders": "545",
    "fulfilledOrders": "400",
    "abandonedOrders": "15",
    "stuckOrders": "30",
    "conversionRate": "6"
  },
  "type": "pie",
  "lastModified": "1470669993"
},
{
  "id": "tcs_orders_2",
  "template": "tcs_orders",
  "context":"development",
  "payload": {
    "orders": "545",
    "fulfilledOrders": "400",
    "abandonedOrders": "15",
    "stuckOrders": "30",
    "conversionRate": "6"
  },
  "type": "bargraph",
  "lastModified": "1470669993"
},
{
  "id": "return_dispositions_1",
  "template": "return_dispositions",
  "context":"development",
  "payload": {
    "wrong_size": "21",
    "incorrect_product_shipped": "45",
    "product_damaged": "3",
    "incorrect_customization": "2"
  },
  "type": "pie",
  "lastModified": "1470669993"
},
{
  "id": "return_dispositions_2",
  "template": "return_dispositions",
  "context":"test",
  "payload": {
    "wrong_size": "7",
    "incorrect_product_shipped": "16",
    "product_damaged": "1",
    "incorrect_customization": "0"
  },
  "type": "pie",
  "lastModified": "1470669993"
},
{
  "id": "return_dispositions_3",
  "template": "return_dispositions",
  "context":"development",
  "payload": {
    "wrong_size": "21",
    "incorrect_product_shipped": "45",
    "product_damaged": "3",
    "incorrect_customization": "2"
  },
  "lastModified": "1470669993"
}
]