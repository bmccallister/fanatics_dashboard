"use strict";

var amqp = require('amqplib/callback_api');
var argv = require('yargs').argv;
var _ = require('lodash');
var totalInterval = 100
var args = argv['_'];
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'fanatics_dashboard';
    
    for (let i=1; i<totalInterval; i++) {

        setTimeout(function(){
            
            var msg = generateMessage();

            console.log('Sending message:', msg);
            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);
            
        }, i*3000);
    }

  });

  setTimeout(function() { conn.close(); process.exit(0) }, totalInterval*3000);
});


function generateMessage()
{
  let messageList = [];
  messageList.push('{"id": "tcs_load1","payload": {"load": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_1","payload": {"orders": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_2","payload": {"orders": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_1","payload": {"wrong_size": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_2","payload": {"wrong_size": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_3","payload": {"wrong_size": "{n}"}}');  

  messageList.push('{"id": "tcs_load1","payload": {"peakConcurrent": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_1","payload": {"fulfilledOrders": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_2","payload": {"fulfilledOrders": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_1","payload": {"incorrect_product_shipped": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_2","payload": {"incorrect_product_shipped": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_3","payload": {"incorrect_product_shipped": "{n}"}}');  

  messageList.push('{"id": "tcs_load1","payload": {"lastHour": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_1","payload": {"abandonedOrders": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_2","payload": {"abandonedOrders": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_1","payload": {"incorrect_customization": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_2","payload": {"incorrect_customization": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_3","payload": {"incorrect_customization": "{n}"}}');  

  messageList.push('{"id": "tcs_load1","payload": {"averageResponse": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_1","payload": {"stuckOrders": "{n}"}}');  
  messageList.push('{"id": "tcs_orders_2","payload": {"stuckOrders": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_1","payload": {"product_damaged": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_2","payload": {"product_damaged": "{n}"}}');  
  messageList.push('{"id": "return_dispositions_3","payload": {"product_damaged": "{n}"}}');  
  
  var randomIndex = Math.floor(Math.random() * 23);

  var randomMessage = messageList[randomIndex];

  return randomMessage.replace("{n}", Math.floor(Math.random() * 1000));
}