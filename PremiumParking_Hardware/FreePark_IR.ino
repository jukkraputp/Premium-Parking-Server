#include <WiFi.h>
#include <HTTPClient.h>
#include <string.h>

#define irPin0 36
#define irPin1 39
#define irPin2 34
#define irPin3 35
#define irPin4 32
#define irPin5 33
#define LED0 23
#define LED1 22
#define LED2 21
#define LED3 19
#define LED4 18
#define LED5 5
#define WIFI_LED 2

#define WIFI_SSID "Stng"
#define WIFI_PASSWORD "11111111"

String serverName = "https://shrouded-ravine-99330.herokuapp.com/api/v1/free-park";
const TickType_t xDelay100ms = pdMS_TO_TICKS(100);
TaskHandle_t Task1 = NULL;
TaskHandle_t Task2 = NULL;
TaskHandle_t Task3 = NULL;
TaskHandle_t Task4 = NULL;
TaskHandle_t Task5 = NULL;
TaskHandle_t Task6 = NULL;
int checker[6] = {0 , 0 , 0, 0, 0 , 0};
int request[6] = {0, 0, 0, 0, 0, 0};
int value[6] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};

int task1Params[3] = {irPin0 , LED0 , 0 };

int task2Params[3] = {irPin1 , LED1 , 1 };

int task3Params[3] = {irPin2 , LED2 , 2 };

int task4Params[3] = {irPin3 , LED3 , 3 };

int task5Params[3] = {irPin4 , LED4 , 4 };

int task6Params[3] = {irPin5 , LED5 , 5 };

//portที่ใช้ได้ 23,22 ,21 ,19,18,5,17,16,4,0,2,15,8,7,6
void func1_Task(void *pvvalue) {
  int *f1param = (int*)pvvalue ;
  int PinIr = f1param[0];
  int ledPin = f1param[1];
  int index = f1param[2];
  while (1) {
    if (digitalRead(PinIr) == 0 && checker[index] == HIGH )  {
      Serial.print("Detect = !");
      Serial.println(PinIr);
      digitalWrite(ledPin, HIGH);
      checker[index] = LOW;
      request[index] += 1;
    }
    else if (digitalRead(PinIr) == 1 && checker[index] == LOW) {
      digitalWrite(ledPin, LOW);
      Serial.print("no Detect !");
      Serial.println(PinIr);
      checker[index] = HIGH;
      request[index] += 1;
    }
    vTaskDelay(xDelay100ms);   // Delay Task นี้ 0.1 วินาที
  }

}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  pinMode(irPin0, INPUT);
  pinMode(LED0, OUTPUT);
  pinMode(irPin1, INPUT);
  pinMode(LED1, OUTPUT);
  pinMode(irPin2, INPUT);
  pinMode(LED2, OUTPUT);
  pinMode(irPin3, INPUT);
  pinMode(LED3, OUTPUT);
  pinMode(irPin4, INPUT);
  pinMode(LED4, OUTPUT);
  pinMode(irPin5, INPUT);
  pinMode(LED5, OUTPUT);
  pinMode(WIFI_LED, OUTPUT);
  Serial.println(checker[0]);

  wifi_connect();

  xTaskCreatePinnedToCore(func1_Task, "Task1", 1000, (void *)task1Params, 1, &Task1, 0);
  xTaskCreatePinnedToCore(func1_Task, "Task2", 1000, (void *)task2Params, 1, &Task2, 0);
  xTaskCreatePinnedToCore(func1_Task, "Task3", 1000, (void *)task3Params, 1, &Task3, 0);
  xTaskCreatePinnedToCore(func1_Task, "Task4", 1000, (void *)task4Params, 1, &Task4, 0);
  xTaskCreatePinnedToCore(func1_Task, "Task5", 1000, (void *)task5Params, 1, &Task5, 0);
  xTaskCreatePinnedToCore(func1_Task, "Task6", 1000, (void *)task6Params, 1, &Task6, 0);
}

void wifi_connect() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  digitalWrite(WIFI_LED, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  for (int i = 0 ; i < 6 ; i++) {
    if (request[i] && checker[i] != value[i]) {
      value[i] = checker[i];
      Serial.println(i);
      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String serverPath = serverName;
        http.begin(serverPath.c_str());
        http.addHeader("Content-Type", "application/json");
        String json = "";
        if (checker[i] == HIGH) {
          json += "{\"slot\":" + String(i) + ",\"value\": true}";
        } else {
          json += "{\"slot\":" + String(i) + ",\"value\": false}";
        }
        int httpResponseCode = http.POST(json);
        request[i] -= 1;
      }
      
    }
  }
  //  readIrSensor(irPin0, LED0, 0);
  //  readIrSensor(irPin1, LED1, 1);
  //  readIrSensor(irPin2, LED2, 2);
  //  readIrSensor(irPin3, LED3, 3);
  //  readIrSensor(irPin4, LED4, 4);
  //  readIrSensor(irPin5, LED5, 5);
  //  delay(100);
}
