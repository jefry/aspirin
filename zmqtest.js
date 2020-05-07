var zmq = require('zeromq')
  , sock = zmq.socket('pull');
 
sock.connect('tcp://127.0.0.1:3003');
console.log('Worker connected to port 3003');
 
sock.on('message', function(msg){
  console.log('work: ' + msg.toString());
});