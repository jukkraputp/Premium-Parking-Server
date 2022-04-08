import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import { AuthContext } from "../../App";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import LeftBox from "../../components/LeftBox";
import RightBox from "../../components/RightBox";
import ErrorIcon from "@material-ui/icons/Error";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../configfirebase";
const TimeContext = React.createContext();
function Home() {
  const { auth, setAuth } = useContext(AuthContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [bookingButtonPress, setBookingButtonPress] = useState(false);
  const [userRFID, setUserRFID] = useState(null);
  const [dataForBooking, setDataForBooking] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [ bookingDetails , setBookingDetails ] = useState({
    date:'',
    start_date:'',
    end_date:''
  })
  const [globalHour , setGlobalHour] = useState(new Date().getHours());

  useEffect(() => {
    const docRef = doc(db, "Users", auth.username);
    getDoc(docRef).then((data) => {
      setUserRFID(data.data().rfid);
      setIsBooking(data.data().reserved);
      if(data.data().reserved){
        setBookingDetails({
          date:data.data().start_date.slice(0,-2),
          start_date:`${data.data().start_date.slice(-2)}.00`,
          end_date:`${data.data().end_date.slice(-2)}.00`
        })
      }
    });
    onSnapshot(docRef, (doc) => {
      let data = doc.data();
      setIsBooking(data.reserved);
      if(data.reserved){
        setBookingDetails({
          date:data.start_date.slice(0,-2),
          start_date:`${data.start_date.slice(-2)}.00`,
          end_date:`${data.end_date.slice(-2)}.00`
        })
      }
    });
  }, []);


  // auto cancel booking
  useEffect(async()=>{
    let docRef = doc(db, "Users", auth.username);
    let docSnap = await getDoc(docRef);
    let end_date = docSnap.data().end_date;
    // console.log(userRFID);
    if(end_date && !!userRFID){
      let end_time = Number(end_date.slice(-2));
      end_date = end_date.slice(0,-2).split(" ");
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
      let monthIndex = monthNames.indexOf(end_date[1]);
      end_date = new Date(Number(end_date[2]),monthIndex,Number(end_date[0])).setHours(0,0,0,0)
      let present_date = new Date().setHours(0,0,0,0)
      // console.log(end_date === present_date);
     
      if( end_date === present_date && globalHour >= end_time || present_date > end_date ){
        setIsBooking(false);
        setDoc(docRef, {
          end_date: false,
          reserved: false,
          rfid: userRFID,
          start_date: false,
        });
        Notification("info", "หมดเวลาจอง");
      }
    }
  },[globalHour ,userRFID])

  function Notification(type, message) {
    enqueueSnackbar(message, {
      variant: type,
      action: (key) => (
        <Button size="small" onClick={() => closeSnackbar(key)}>
          Dismiss
        </Button>
      ),
    });
  }

  async function ConfirmBooking() {
    try {
      console.log("dataForBooking", dataForBooking);
      if (!!dataForBooking) {
        let date = dataForBooking.date.toString();
        let start_time = Number(dataForBooking.start_time);
        let end_time = Number(dataForBooking.end_time);
        for (let index = start_time; index < end_time; index++) {
          let docRef = doc(db, "RFID", date + " " + index.toString());
          console.log("docID:", date + " " + index.toString());
          let docSnap = await getDoc(docRef);
            let done = 0;
          if (docSnap.exists()) {
            let datas = docSnap.data();
            Object.keys(datas).forEach((key) => {
              if (key.includes("user") && done === 0 ) {
                if (datas[key] === false) {
                  datas[key] = userRFID;
                  datas["available"] -= 1;
                  setDoc(docRef, datas);
                  let userDocRef = doc(db, "Users", auth.username);
                  setDoc(userDocRef, {
                    end_date: date + " " + end_time.toString(),
                    reserved: true,
                    rfid: userRFID,
                    start_date: date + " " + start_time.toString(),
                  });
                  done = 1;
                  setBookingButtonPress(false);
                }
              }
            });
          }
          if (done === 0) {
            setBookingButtonPress(false);
            throw "Not available!"; 
          }
        }
        Notification("success", "Booking complete!");
        
      }
    } catch (err) {
      console.log(err);
      Notification("error", err.message ? err.message : err);
    }
  }

  async function CancelBooking() {
    try {
      let docRef = doc(db, "Users", auth.username);
      let docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let datas = docSnap.data();
        let start_date = datas.start_date;
        let end_date = datas.end_date;
        let start_time = Number(start_date.slice(-2));
        let end_time = Number(end_date.slice(-2));
        let date = start_date.slice(0, 11);
        for (let index = start_time; index < end_time; index++) {
          let date_time = date + " " + index.toString();
          docRef = doc(db, "RFID", date_time);
          let docData = await getDoc(docRef);
          let done = 0;
          if (docData.exists()) {
            datas = docData.data();
            Object.keys(datas).forEach((key) => {
              if (key.includes("user") && datas[key] === userRFID && done === 0) {
                datas[key] = false;
                datas["available"] += 1;
                setDoc(docRef, datas);
                let userDocRef = doc(db, "Users", auth.username);
                setDoc(userDocRef, {
                  end_date: false,
                  reserved: false,
                  rfid: userRFID,
                  start_date: false,
                });
                done = 1;
                setBookingButtonPress(false);
              }
            });
          }
          if (done == 0) {
            setBookingButtonPress(false);
            throw 'error';
          }
        }
        
        Notification("success", "Booking canceled successfully!");
        
          
      }
      
    } catch (err) {
      console.log(err);
      Notification("error", err.message ? err.message : err);
    }
  }
  return (
    <div className="Home">
      <Navbar />
      <TimeContext.Provider value={{ globalHour, setGlobalHour}}>
        <div className="container-box">
          <LeftBox  />
          <RightBox
            setBookingButtonPress={setBookingButtonPress}
            setDataForBooking={setDataForBooking}
            isBooking={isBooking}
            setIsBooking={setIsBooking}
          />
        </div>
      </TimeContext.Provider>
      <AnimatePresence>
        {bookingButtonPress && (
          <div className="pop-up">
            <motion.div
              className="confirm-block"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="confirm-block-header">
                <ErrorIcon style={{ fontSize: 80, color: "#e99f18" }} />
                { isBooking  ? (
                  <>
                    <p style={{marginTop:'15px' , fontSize:'26px' ,fontWeight:500 }}> Cancel booking? </p>
                    <div style={{ display:'flex' , flexDirection:'column' , alignItems:'center'}}>
                      <p style={{fontSize:20 ,fontWeight:500}} >{bookingDetails.date}</p>
                      <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , width:'50%' , gap:5}}>
                        <p style={{marginBottom:0 ,fontSize:18 ,fontWeight:500}}>{bookingDetails.start_date}</p>
                        <p style={{marginBottom:0 ,fontSize:18 ,fontWeight:500}}>-</p>
                        <p style={{marginBottom:0 ,fontSize:18 ,fontWeight:500}}>{bookingDetails.end_date}</p>
                      </div>
                    </div>  
                  </>
                ) : (
                  <>
                    <p style={{marginTop:'15px' , fontSize:'26px' ,fontWeight:500 }}>Confirm booking?</p>
                    <div style={{ display:'flex' , flexDirection:'column' , alignItems:'center'}}>
                      <p style={{fontSize:20 ,fontWeight:500}} >{dataForBooking.date}</p>
                      <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , width:'50%' , gap:5}}>
                        <p style={{marginBottom:0 ,fontSize:18 ,fontWeight:500}}>{dataForBooking.start_time}</p>
                        <p style={{marginBottom:0 ,fontSize:18 ,fontWeight:500}}>-</p>
                        <p style={{marginBottom:0 ,fontSize:18 ,fontWeight:500}}>{dataForBooking.end_time}</p>
                      </div>
                    </div> 
                  </>
                )}
              </div>
              <div className="confirm-or-cancel-block">
                <div
                  className="confirm-button"
                  onClick={() => {
                    if (isBooking) CancelBooking();
                    else ConfirmBooking();
                  }}
                >
                  <CheckCircleIcon />
                  <p>Confirm</p>
                </div>
                <div
                  className="cancel-buttton"
                  onClick={() => setBookingButtonPress(false)}
                >
                  <CancelIcon />
                  <p>Cancel</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>
    </div>
  );
}
export { TimeContext };
export default Home;
