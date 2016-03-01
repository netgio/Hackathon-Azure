var mqtt    = require('mqtt');

var fs = require("fs");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor 
 
// Initialise COM port with Arduino MCU
var sp = new SerialPort("/dev/ttyS0", {
        baudRate:57600,
        parser: serialport.parsers.readline("\n")
    });


//TODO add cmd line error checking
var myArgs = process.argv.slice(2);
// var payload = myArgs[1];

//TODO add file presense checking
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
    
console.log( "Config Loaded:\n" + JSON.stringify(conf, null, 4 ));

var client  = mqtt.connect(uri, conf );
 
client.on('connect', function () {
  // once connected, listen for data on the serial port.
  console.log("Connected");
  client.subscribe(subTopic);
  // when the port is open
  sp.on("open", function () {
    console.log('Serial open');
    // add "send" handler to send serial data to the pubTopic
    sp.on("data", function (data) {
            //TODO add data validation here
            client.publish(pubTopic, data);
            console.log("sending: " + data);
        });
    // add "message" handler to send subTopic messages to serial

    });
});

client.on('message', function (topic, message) {
    // message is Buffer 
    console.log("Rx'd Message on [" + topic + "]:" + message.toString());
    //Append a newline to the end
    sp.write(message + "\n", function(err, results) {
            console.log('Serial err: ' + err);
            console.log('Serial results: ' + results);
        });
    });

  
