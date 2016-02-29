var mqtt    = require('mqtt');
var client  = mqtt.connect("mqtts://Hackathon.azure-devices.net", 
    { 
       "clean": false, 
       "clientId":"test", 
       "username": "Hackathon.azure-devices.net/test/DeviceClientType=azure-iot-device%2F1.0.1",
       "password": "SharedAccessSignature sr=Hackathon.azure-devices.net/devices/test&sig=%2FWjIdWhXTiS9LutkM7qcQL10oCmNzgtYWIonasHG4BQ%3D&se=1456776593", 
       "protocolId":"MQTT", 
       "protocolVersion":4, 
       "rejectUnauthorized": false
    });
 
client.on('connect', function () {
  //client.subscribe('presence');
  client.publish('devices/test/messages/events', 'Hello mqtt');
  process.exit(1);
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  client.end();
});