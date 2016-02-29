// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

//var Amqp = require('azure-iot-device-amqp').Amqp;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var AmqpWs = require('azure-iot-device-amqp-ws').AmqpWs;
// var Http = require('azure-iot-device-http').Http;
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
var fs = require("fs");
var mqttConf = JSON.parse(fs.readFileSync("mqtt.conf"));
var connectionString = mqttConf.connectionString;
var pubTopic = mqttConf.pubTopic;
var subTopic = mqttConf.subTopic;

var myArgs = process.argv.slice(2);
var payload = myArgs[0];

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Mqtt);

// use Message object from core package

var connectCallback = function (err) {
  if (err) {
    console.err('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
      // reject and abandon follow the same pattern.
      // /!\ reject and abandon are not available with MQTT
    });

   var message = new Message(payload);
   message.properties.add('myproperty', 'myvalue');
   console.log('Sending message: ' + message.getData());
   client.sendEvent(message, printResultFor('send'));
    
   client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      client.removeAllListeners();
      client.connect(connectCallback);
    });
  }
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
    client.close(function(){process.exit(1)});
  };
}