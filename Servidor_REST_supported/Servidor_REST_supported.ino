#include <DHT.h>
#include <DHT_U.h>

#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

#define DHTPIN 26  // Replace with your actual GPIO pin number
#define DHTTYPE DHT11  // DHT11 or DHT22

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "HostpotACV";
const char* password = "porraspato23";


void setup() {
  Serial.begin(115200); //Serial connection
  setup_wifi(); //WiFi connection
  dht.begin();
  delay(1500);
}

void setup_wifi() {
    delay(10);
    // We start by connecting to a WiFi network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  float temp = dht.readTemperature();
  int humo = analogRead(35);

  String variable;

  DynamicJsonDocument doc(1024);

  doc["temperatura"] = temp;
  doc["humo"] = humo;
  doc["idnodo"] = 1;
  doc["timestamp"] = 1655133862;

  serializeJson(doc, variable);

  Serial.println("dato a enviar: "+ variable);

  HTTPClient http;
  WiFiClient client;
  http.begin(client, "http://172.20.10.3:3000/datos");
  http.addHeader("Content-Type", "application/json", 0, 0);

  int httpCode = http.POST(variable); //Send the request
  String payload = http.getString(); //Get the response payload

  Serial.println(httpCode); //Print HTTP return code
  Serial.println(payload); //Print request response payload
  http.end(); //Close connection

  delay(5000); //Send a request every 30 seconds
}