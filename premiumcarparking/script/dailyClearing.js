const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

var d = new Date();

const day = d.getDate().toString();
const month = monthNames[d.getMonth()];
const year = d.getFullYear().toString();
const date = day + ' ' + month + ' ' + year;
d.setDate(d.getDate() + 3);
const day_3 = d.getDate().toString();
const month_3 = monthNames[d.getMonth()];
const year_3 = d.getFullYear().toString();
const date_3 = day_3 + ' ' + month_3 + ' ' + year_3;

for (let hour = 10; hour < 22; hour++) {
  const H = hour.toString();
  var docRef = date + " " + H;
  db.collection("RFID").doc(docRef).delete();
  docRef = date_3 + " " + H;
  db.collection("RFID").doc(docRef).set({
    available: 6,
    user1: false,
    user2: false,
    user3: false,
    user4: false,
    user5: false,
    user6: false,
  });
}
