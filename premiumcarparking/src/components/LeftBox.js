import React, { useEffect, useState , useContext } from "react";
import "./LeftBox.css";
import ScrollReveal from "scrollreveal";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DateRangeIcon from "@material-ui/icons/DateRange";
import RealClock from "./RealClock";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../configfirebase";
import getTime from "../data";
import { TimeContext } from "../pages/HomePage/Home";
function LeftBox() {
  const [VIPSlots, setVIPSlots] = useState(0);
  const [FreeSlots, setFreeSlots] = useState(0);
  const [ToDay, setToDay] = useState("");
  const { globalHour } = useContext(TimeContext);
  const slideFromTop = {
    distance: "500px",
    origin: "top",
    opacity: "0",
    duration: 2400,
    reset: false,
  };
  
  useEffect(() => {
    ScrollReveal().reveal(".left-block", slideFromTop);
  }, []);

  useEffect(()=>{
    const d = new Date();
    let date = d.getDate().toString();
    const hour = d.getHours().toString();
    let date_time = date + " " + hour;
    // console.log("date_time =", date_time);
    let colRef = collection(db, "RFID");
    let unsubscribeVIP = onSnapshot(colRef, (snapshot) => {
      let slots = snapshot.docs;
      //   console.log(slots[hour - 10].data());
      setVIPSlots(slots[hour - 10].data().available);
    });
    colRef = collection(db, "FreePark");
    let unsubscribeFREE = onSnapshot(colRef, (snapshot) => {
      let slots = snapshot.docs;
      let countFreeSlots = 0;
      slots.forEach((slot)=>{
        if(slot.data().available){
          countFreeSlots += 1;
        }
      })
      setFreeSlots(countFreeSlots);
    });
    let toDay = getTime();

    setToDay(toDay[0]);

    return ()=>{
      unsubscribeVIP();
      unsubscribeFREE();
    }
  },[globalHour])

  return (
    <div className="left-block">
      <div className="DateAndTime">
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            width: "100%",
          }}
        >
          <DateRangeIcon style={{ fontSize: 35, marginLeft: "50px" }} />
          <p
            style={{ fontSize: "25px", marginBottom: 0, marginLeft: 5 }}
          >{`${ToDay.day} ${ToDay.month} ${ToDay.year}`}</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            width: "100%",
          }}
        >
          <AccessTimeIcon style={{ fontSize: 35, marginLeft: "50px" }} />
          <RealClock />
        </div>
      </div>
      <div className="vip-parking">
        <div className="vip-parking-header">
          <h2>VIP Parking</h2>
        </div>
        <div className="vip-parking-available">
          <h3>{VIPSlots}</h3>
          <p>Available slot</p>
        </div>
      </div>
      <div className="free-parking">
        <div className="free-parking-header">
          <h2>Free Parking</h2>
        </div>
        <div className="free-parking-available">
          <h3>{FreeSlots}</h3>
          <p>Available slot</p>
        </div>
      </div>
    </div>
  );
}

export default LeftBox;
