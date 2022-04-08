# Premium-Parking

## Front-end

Front-end ของเว็บไซต์ใช้ react ในการเขียนและประกอบ 2 pages คือหน้า Home และ Login โดยจะเป็นระบบการจองคิวโดยให้สมาชิกจองคิว
และเวลาผ่านทางเว็บไซต์ และ RIFD Tag ของลูกค้าก็จะเข้าไปในระบบและลูกค้าจะสามารถแสกนผ่าน Sensor ได้ในเวลาที่ลูกค้าจองไว้

## Back-end

Back-end ทางเราใช้ python ในการเขียนโดยผ่าน flask และใช้ firebas_admin เพื่อใช้ในการติดต่อกับ Database 
ซึ่ง Back-end เข้าไปมีส่วนร่วมกับการติดต่อระหว่าง Hardware กับ Front-end โดย backend ใช้ในการส่งระหว่าง Hardware และ Database 
กับ Database และ Frontend โดยซึ่งประกอบไปด้วย library 

- flask
- firebase_admin
- json
- datetime

Database and Storage: Firebase 

## Hardware

ในส่วนของ Hardware เราใช้ Arduino ในการเขียนโดยอุปกรณ์ที่ใช้จะประกอบไปด้วย

- Esp32 wroom 32 *6
- Ir sensor *14
- RFID *2
- Servo motor *2
- Flame Sensor *2
- Buzzer *2

## Contributors

This project is part of the course Embeded System 01204322 in Computer Engineering Faculty of Engineering Kasetsart University

- Project Link: <https://github.com/jukkraputp/Premium-Parking-Server>
- Present Link: <https://youtu.be/G0xv5Qx5HtM>

|                       |            |
| ----------------------| ---------- |
|Pawat Thirasakthana    | 6210500536 |
|Suprawit Pattanasin    | 6210500161 |
|Jukkraput Pikunyam     | 6210500498 |
|Kuntapong Preedipan    | 6210500099 |
|Boonsak Surisarn       | 6210503683 |
|Nopparuj Sirirojanakorn| 6210503632 |

![Main pic](https://cdn.discordapp.com/attachments/915420724234174544/961905017294581820/Screenshot_2022-03-26_195240.jpg)
