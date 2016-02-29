var fs = require("fs");

var conf = {};

var myArgs = process.argv.slice(2);
conf["connectionString"] = myArgs[0];
conf["pubTopic"] = myArgs[1];
conf["subTopic"] = myArgs[2];

var outputFilename = "mqtt.conf"; 

fs.writeFile(outputFilename, JSON.stringify(conf, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
}); 
