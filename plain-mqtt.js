var mqtt    = require('mqtt');

var fs = require("fs");

var myArgs = process.argv.slice(2);
var payload = myArgs[1];

var mqttConf = JSON.parse(fs.readFileSync(myArgs[0]));
var connectionString = mqttConf.connectionString;
var uri = mqttConf.uri;
var pubTopic = mqttConf.pubTopic;
var subTopic = mqttConf.subTopic;
var clientId = mqttConf.clientId;
var username = mqttConf.username;
var password = mqttConf.password;


var conf = { 
       "clean": false, 
       "clientId": clientId, 
       "username": username,
       "password": password, 
       "protocolId":"MQTT", 
       "protocolVersion":4, 
       "rejectUnauthorized": false
    };
    
console.log(JSON.stringify(conf));

var client  = mqtt.connect(uri, conf );
 
client.on('connect', function () {
  //client.subscribe('presence');
  client.publish(pubTopic, payload);
  process.exit(1);
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  client.end();
});