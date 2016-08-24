var amqp = require('amqplib/callback_api');
var DataModel = require("./models/tableauDataModel");

amqp.connect('amqp://localhost', function(err, conn) {
  console.log('I had error:', err);
  if(!conn) {
	console.log('No connection');
	process.exit(0);
  }
  conn.createChannel(function(err, ch) {
    var q = 'fanatics_dashboard';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      try {
        console.log('Parsing to json')
        var jsonObject = JSON.parse(msg.content.toString());
        console.log('Json Object:', jsonObject);
        DataModel.updatePayloadData(jsonObject, function(results) {
          console.log('Processed command with results:', results);
        })
      } catch (exception) {
        console.log('Caught exception:', exception);
      }
    }, {noAck: true});
  });
})
