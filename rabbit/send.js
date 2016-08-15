var amqp = require('amqplib/callback_api');
var argv = require('yargs').argv;
var _ = require('lodash');

var args = argv['_'];
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'fanatics_dashboard';
	if (argv.q) {
		q = argv.g;
	}
    var msg = '';
    if (args.length>=1) {
      _.each(args, function(row, $index) {
        if ($index>0) 
          msg+=' ';
        msg+=row;
      })
    } 
    console.log('Sending message:', msg);
    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
