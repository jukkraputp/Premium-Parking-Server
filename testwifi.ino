#include <Arduino.h>
#include<WiFi.h>
#include <SPI.h>//https://www.arduino.cc/en/reference/SPI
#include <MFRC522.h>//https://github.com/miguelbalboa/rfid
#include <HTTPClient.h>
#include <string.h>
#include <ESP32Servo.h>
//
#define irPin 21
Servo myservoIn;
Servo myservoOut;

const TickType_t xDelay5000ms = pdMS_TO_TICKS(5000);
const TickType_t xDelay1000ms = pdMS_TO_TICKS(1000); 
const TickType_t xDelay100ms = pdMS_TO_TICKS(100);
TaskHandle_t Task1 = NULL;
//TaskHandle_t Task2 = NULL;
TaskHandle_t Task3 = NULL;

int checkIn = 0;

//Constants
#define SS_PIN 5
#define RST_PIN 22
#define WIFI_SSID "Bbb01"
#define WIFI_PASSWORD "bankbank"
String serverName = "https://shrouded-ravine-99330.herokuapp.com/check_in?RFID=";
byte nuidPICC[4] = {0, 0, 0, 0};
int ans[4] = {502, 220, 220, 220} ;
String check_rf01;
String check_rf02;
String check_rf03;
String check_rf04;
String all_string;
int counter=0;
int modeSet=0;
//const int _size=2*JSON_OBJECT_SIZE(4);
MFRC522::MIFARE_Key key;
MFRC522 rfid = MFRC522(SS_PIN, RST_PIN);

void func1_Task(void *pvParam){
    while(1){
      if(checkIn == 0){
        myservoIn.write(0); // สั่งให้ Servo หมุนไปองศาที่ 0
        //vTaskDelay(xDelay1000ms);
      }
      else{
        myservoIn.write(100); // สั่งให้ Servo หมุนไปองศาที่ 90
//        vTaskDelay(xDelay1000ms);
      }
//      delay(2000); // หน่วงเวลา 1000ms
      vTaskDelay(xDelay100ms);   // Delay Task นี้ 2 วินาที
    }
  }

void func3_Task(void *pvParam){
    while(1){
      if (digitalRead(irPin) == 0){
//        Serial.println("Detect = !");
        checkIn = 0;
      }

        vTaskDelay(xDelay100ms);   // Delay Task นี้ 2 วินาที
    }
  }

void wifi_connect(){
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

void Seturl(void){
  for(int temp=0;temp<4;temp++){
    if(temp==0){
        check_rf01=String(ans[temp]);   
      }
    else if(temp==1){
        check_rf02=String(ans[temp]);  
      }
    else if(temp==2){
        check_rf03=String(ans[temp]);     
      }
    else if(temp==3){
        check_rf04=String(ans[temp]);     
      }
  }
  all_string = serverName+ check_rf01+ check_rf02+check_rf03+check_rf04;
  //Serial.println(all_string);
  }


void readRFID(void ) { /* function readRFID */
  ////Read RFID card

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  // Look for new 1 cards
  if ( ! rfid.PICC_IsNewCardPresent())
    {
    //Serial.print("test");
    return;
    }

  // Verify if the NUID has been readed
  if (  !rfid.PICC_ReadCardSerial())
    return;

  // Store NUID into nuidPICC array
  int j=0;
  for (byte i = 0; i < 4; i++) {
    nuidPICC[i] = rfid.uid.uidByte[i];
    ans[j]=int(nuidPICC[j]);
    j++;
  }
  
  for(int temp=0;temp<4;temp++){
   Serial.print(ans[temp]);
   Serial.print(" ");
  }
  Serial.println();
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  Seturl();
  _get();
  //return ans;
}

void _get(){
if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;

      String serverPath = all_string;
            
      // Your Domain name with URL path or IP address with path
      http.begin(serverPath.c_str());
      
      // Send HTTP GET request
      int httpResponseCode = http.GET();  

      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        if (payload=="1"){
          checkIn = 1;
          Serial.println(checkIn);
          }
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }
    else {
      Serial.println("WiFi Disconnected Reconect");
      wifi_connect();
    }
  
}



void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  wifi_connect();
  Serial.println(F("Initialize System"));
  //init rfid D8,D5,D6,D7
  SPI.begin();
  rfid.PCD_Init();
  Serial.print(F("Reader :"));
  rfid.PCD_DumpVersionToSerial();


   myservoIn.attach(22);
   pinMode(irPin, INPUT);
   xTaskCreatePinnedToCore(func1_Task,"Task1",1000,NULL,1,&Task1,0);
   xTaskCreatePinnedToCore(func3_Task,"Task3",1000,NULL,1,&Task3,1);
   
}

void loop() {
  readRFID();
  
  delay(100);
}
