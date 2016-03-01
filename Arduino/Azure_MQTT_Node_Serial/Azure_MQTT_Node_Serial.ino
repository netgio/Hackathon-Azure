/*
Very basic Serial client for talking to Node-MQTT server for Azure IoT connections
 */

void setup() {
  Serial.begin(115200);      // open serial connection via USB-Serial
  Serial1.begin(57600);  // open serial connection to Linux
  Serial1.setTimeout(1000);
}

void loop() {
  delay(1000);
  Serial1.println("{\"Data\":\"Some Data\"}");
  if (Serial1.available() > 0)
  {
     String message = Serial1.readString();
     Serial.println(message);
  }
  Serial.println("XXXX");
}
