import React, { useEffect, useState ,useContext} from "react";
import "./RightBox.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";
import getTime from "../data";
import DateBlock from "./DateBlock";
import Button from "@material-ui/core/Button";
import ScrollReveal from "scrollreveal";
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import BookIcon from "@material-ui/icons/Book";
import BlockIcon from '@material-ui/icons/Block';
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  
} from "firebase/firestore";
import { db } from "../configfirebase";
import { TimeContext } from "../pages/HomePage/Home";

function RightBox({ setBookingButtonPress, setDataForBooking, isBooking }) {
  let D = new Date();
  const [date, setDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedStartTime, setSelectedStartTime] = useState(
    D.getHours().toFixed(2)
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    (D.getHours() + 1).toFixed(2)
  );
  const [VIPSlots, setVIPSlots] = useState(0);

  const availableTime = [
    10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0,
    22.0,
  ];
  const slideFromBottom = {
    distance: "150px",
    origin: "bottom",
    opacity: "0",
    duration: 2900,
    reset: false,
  };
  const { globalHour } = useContext(TimeContext);

  useEffect(() => {
    let dayAvailable = getTime();
    ScrollReveal().reveal(".right-block", slideFromBottom);
    setDate(dayAvailable);

    if (Number(selectedStartTime) >= 22) {
      setSelectedStartTime(availableTime[11].toFixed(2));
      setSelectedEndTime(availableTime[12].toFixed(2));
    }
    else if( Number(selectedStartTime) < 10 ){
      setSelectedStartTime(availableTime[0].toFixed(2));
      setSelectedEndTime(availableTime[1].toFixed(2));
    }
  }, []);

  useEffect(()=>{
    let dayAvailable = getTime();
    setDate(dayAvailable);
    D = new Date();
    if(D.getHours() >= 10  && D.getHours() < 22  )
      setSelectedStartTime(D.getHours().toFixed(2));
    else if(D.getHours() === 0)
      setSelectedStartTime(availableTime[0].toFixed(2));
  },[globalHour])

  useEffect(()=>{

    let colRef = collection(db, "RFID");
    let unsubscribe = onSnapshot(colRef, (snapshot) => {
      let hour = Math.ceil(selectedStartTime);
      if (hour > 22 || hour < 10) hour = 10;
      let index = 0;
      if (date[selectedDate] !== undefined) {
        const DATE = date[0].day;
        if (date[selectedDate].day == DATE) {
          index = 0;
        } else {
          index = (date[selectedDate].day - DATE) * 12;
        }
      }
      let min = 6;
      let slots = snapshot.docs;
      for(hour ; hour < Number(selectedEndTime); hour++){
        // console.log('hour : ',hour);
        if(slots[index + hour - 10].data().available < min)
          min = slots[index + hour - 10].data().available;
          setVIPSlots(min);
      }
    });
    return ()=>unsubscribe();
  },[selectedStartTime,selectedEndTime,selectedDate])
  // console.log('haaa : ',selectedStartTime);
  // console.log(date[selectedDate]);

  useEffect(async() => {
    if (date.length === 3) {
      let time_start = Number(selectedStartTime);
      let time_end = Number(selectedEndTime);
      let available_slots;
      let min_val = 999;
      for (let index = time_start; index < time_end; index++) {
        const date_time =
          date[selectedDate].day.toString() +
          " " +
          date[selectedDate].month.toString() +
          " " +
          date[selectedDate].year.toString() +
          " " +
          index.toString();
        let docRef = doc(db, "RFID", date_time);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let data = docSnap;
          available_slots = data.data().available;
          min_val = Math.min(min_val, available_slots);
          // console.log(index, "slots =", min_val);
          setVIPSlots(min_val);
        }
      }
      
    }
  }, [selectedStartTime, selectedEndTime, selectedDate]);

  useEffect(() => {
    if (selectedStartTime >= selectedEndTime)
      setSelectedEndTime((Number(selectedStartTime) + 1).toFixed(2));
  }, [selectedStartTime]);

  useEffect(() => {
    if (
      date[selectedDate] !== undefined &&
      date[selectedDate].day === D.getDate() 
    ) {
      if(D.getHours() >= 22){
        setSelectedStartTime(availableTime[11].toFixed(2));
        setSelectedEndTime(availableTime[12].toFixed(2));
      }
      else if(D.getHours() <= 9){
        setSelectedStartTime(availableTime[0].toFixed(2));
        setSelectedEndTime(availableTime[1].toFixed(2));
      }
      else{
        setSelectedStartTime(D.getHours().toFixed(2));
        setSelectedEndTime((D.getHours() + 1).toFixed(2));
      }
    } 
    // else if (
    //   date[selectedDate] !== undefined &&
    //   date[selectedDate].day !== D.getDate()
    // ) {
    //   setSelectedStartTime(availableTime[0].toFixed(2));
    //   setSelectedEndTime(availableTime[1].toFixed(2));
    // }
  }, [selectedDate]);

  return (
    <div className="right-block">
      <div className="right-block-header">
        <p style={{ fontSize: "35px" }}>Select Parking</p>
      </div>
      <div className="RowIn-right-block">
        <div className="VIPReservedAvailable">
          <h4>Available slot</h4>
          <div className="Reserved-details">
            <p>
              On{" "}
              {`${date[selectedDate]?.day} ${date[selectedDate]?.month} ${date[selectedDate]?.year}`}{" "}
            </p>
            <p>
              At{" "}
              {`${!!selectedStartTime ? selectedStartTime : "--.--"} to ${
                selectedEndTime ? selectedEndTime : "--.--"
              }`}
            </p>
          </div>

          <div className="ReservedAvailable">
            <p>{VIPSlots}</p>
          </div>
        </div>
        <div className="DateAndTimeForReserved">
          <div className="DateForReserved">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4>Booking</h4>
              <BookIcon style={{ color: "#0d324d", fontSize: 30 }} />
            </div>
            <Swiper
              className="row-container"
              navigation={true}
              slidesPerView={1}
              slidesPerGroup={1}
              // spaceBetween={1}
              grabCursor={true}
              modules={[Pagination, Navigation]}
              pagination={{
                dynamicBullets: true,
              }}
              // breakpoints={{
              //     720:{
              //     slidesPerView:1,
              //     }
              // }}
              onSlideChange={(index) => setSelectedDate(index.activeIndex)}
            >
              {date.map((day, key) => {
                return (
                  <SwiperSlide key={key}>
                    <DateBlock details={day} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="timeForReserved">
            <h4 style={{fontFamily:"'Prompt', sans-serif"}}>เลือกเวลาจอง</h4>
            <div className="time-optional">
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle"
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                    width: `${selectedStartTime ? "75px" : "100px"}`,
                    backgroundColor:'white'
                  }}
                  type="button"
                  id="dropdownMenuButton2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedStartTime ? selectedStartTime : "Start time"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu"
                  style={{ boxShadow: "rgb(0 0 0 / 22%) 0px 1px 7px 1px" }}
                  aria-labelledby="dropdownMenuButton2"
                >
                  {date[selectedDate] !== undefined &&
                    availableTime.map((time, key) => {
                      if (
                        Number(time) !== 22 &&
                        Number(time) >= D.getHours() &&
                        date[selectedDate].day === D.getDate()
                      )
                        return (
                          <li key={key}>
                            <a
                              className={`dropdown-item ${
                                selectedStartTime === time.toFixed(2) ? "active" : ""
                              }`}
                              onClick={(e) => {
                                setSelectedStartTime(
                                  availableTime[key].toFixed(2)
                                );
                              }}
                            >
                              {time.toFixed(2)}
                            </a>
                          </li>
                        );
                      else if (
                        Number(time) !== 22 &&
                        date[selectedDate].day !== D.getDate()
                      )
                        return (
                          <li key={key}>
                            <a
                              className={`dropdown-item ${
                                selectedStartTime === time.toFixed(2) ? "active" : ""
                              }`}
                              onClick={(e) => {
                                setSelectedStartTime(
                                  availableTime[key].toFixed(2)
                                );
                              }}
                            >
                              {time.toFixed(2)}
                            </a>
                          </li>
                        );
                    })}
                </ul>
              </div>
              <p>To</p>
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle"
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                    width: `${selectedEndTime ? "75px" : "100px"}`,
                    backgroundColor:'white'
                  }}
                  type="button"
                  id="dropdownMenuButton2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedEndTime ? selectedEndTime : "End time"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu"
                  style={{ boxShadow: "rgb(0 0 0 / 22%) 0px 1px 7px 1px" }}
                  aria-labelledby="dropdownMenuButton2"
                >
                  {availableTime.map((time, key) => {
                    if (Number(time) > Number(selectedStartTime))
                      return (
                        <li key={key}>
                          <a
                            className={`dropdown-item ${
                              selectedEndTime === time.toFixed(2) ? "active" : ""
                            }`}
                            onClick={(e) => {
                              setSelectedEndTime(availableTime[key].toFixed(2));
                            }}
                          >
                            {time.toFixed(2)}
                          </a>
                        </li>
                      );
                  })}
                </ul>
              </div>
            </div>
            {isBooking ? (
              <Button
                className="cancel-button"
                style={{
                  textShadow: "2px 2px #25252531",
                  color: "white",
                  marginTop: "30px",
                  boxShadow: "rgb(0 0 0 / 22%) 0px 1px 7px 1px",
                  fontWeight: "400",
                  fontSize: "17px",
                }}
                onClick={() => {
                  setBookingButtonPress(true);
                }}
              >
                <BlockIcon />
                <p style={{fontFamily:"'Prompt', sans-serif"}}>ยกเลิกการจอง</p>
              </Button>
            ) : (
              <Button
                className="booking-button"
                onClick={() => {
                  setBookingButtonPress(true);
                  setDataForBooking({
                    date: `${date[selectedDate].day} ${date[selectedDate].month} ${date[selectedDate].year}`,
                    start_time: `${selectedStartTime}`,
                    end_time: `${selectedEndTime}`,
                  });
                }}
                style={{
                  textShadow: "2px 2px #25252531",
                  color: "white",
                  marginTop: "30px",
                  boxShadow: "rgb(0 0 0 / 22%) 0px 1px 7px 1px",
                  fontWeight: "500",
                  fontSize: "19px",
                  transition: "0.5s all",
                }}
              >
                <LibraryAddIcon />
                <p style={{fontFamily:"'Prompt', sans-serif"}}>จอง</p>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightBox;
