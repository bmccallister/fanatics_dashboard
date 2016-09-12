module.exports.tableauComponents = [
    {
  "name": "tcs_load",
  "title": "TCS Load",
  "description":"TCS Load Monitoring",
  "interval": "1000",
  "apiInterval": 1000,
  "acceptPush": false,
  "values": [
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
  "thresholdFields": [
    "averageResponse"
  ]
},
{
  "name": "tcs_orders",
  "title":"TCS Orders",
  "description": "TCS Order Monitoring",
  "interval": "1000",
  "acceptPush": false,
  "values": [
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
  "module": "tcs_orders"
}
];

module.exports.tableauData = [
    {
  "component": "tcs_load",
  "id": "tcs_load1",
  "payload": {
    "averageResponse": "1",
    "lastHour": "5000",
    "load": "999",
    "peakConcurrent": "50000",
    "systemHealth": "99%"
  },
  "timestamp": "1470661893"
},
{
  "timestamp": "1470669993",
  "id": "tcs_orders_1",
  "component": "tcs_orders",
  "payload": {
    "orders": "545",
    "fulfilledOrders": "400",
    "abandonedOrders": "15",
    "stuckOrders": "30",
    "conversionRate": "6"
  },
  "type": "pie",
  "ignoredFields": "orders"
},
{
  "timestamp": "1470669993",
  "id": "tcs_orders_1",
  "component": "tcs_orders",
  "payload": {
    "orders": "545",
    "fulfilledOrders": "400",
    "abandonedOrders": "15",
    "stuckOrders": "30",
    "conversionRate": "6"
  },
  "type": "bargraph",
  "ignoredFields": "orders"
}
]