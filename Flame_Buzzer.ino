#define LDR_PIN0 23
#define BUZZER_PIN0 22
#define LDR_PIN1 19
#define BUZZER_PIN1 18

void setup() {
  Serial.begin(115200);
  pinMode(LDR_PIN0, INPUT_PULLUP);
  pinMode(BUZZER_PIN0, OUTPUT);
  pinMode(LDR_PIN1, INPUT_PULLUP);
  pinMode(BUZZER_PIN1, OUTPUT);

}
void loop() {
  
if (digitalRead(LDR_PIN0) == HIGH && digitalRead(LDR_PIN1) == HIGH) {
  Serial.println("FALSE!");
  
} else {
  Serial.println("TRUE! ");
  digitalWrite (BUZZER_PIN0, HIGH);
  digitalWrite (BUZZER_PIN1, HIGH);
  delay(1000);
  digitalWrite (BUZZER_PIN0, LOW);
  digitalWrite (BUZZER_PIN1, LOW);
}

delay(250);
}
