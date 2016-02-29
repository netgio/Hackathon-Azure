var mqtt    = require('mqtt');

var fs = require("fs");

var mqttConf = JSON.parse(fs.readFileSync("mqtt.conf"));
var connectionString = mqttConf.connectionString;
var pubTopic = mqttConf.pubTopic;
var subTopic = mqttConf.subTopic;
var clientId = mqttConf.clientId;
var username = mqttConf.username;
var password = mqttConf.password;

var myArgs = process.argv.slice(2);
var payload = myArgs[0];

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

var client  = mqtt.connect("mqtts://Hackathon.azure-devices.net", conf );
 
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