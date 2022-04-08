import React, { useEffect, useState ,useContext} from 'react'
import { TimeContext } from "../pages/HomePage/Home";
function RealClock() {
    let time = new Date().toLocaleTimeString('en-US');
    const [ ctime , setCtime ] = useState(time);
    const { globalHour , setGlobalHour } = useContext(TimeContext);

    function getTime(){
        time = new Date().toLocaleTimeString('en-US');
        setCtime(time);
        // console.log('global time: ',globalHour);
        if(globalHour !== new Date().getHours()){
            setGlobalHour(new Date().getHours());
            console.log('real time: ',new Date().getHours());
        }
    }
    useEffect(()=>{
        let clock = setInterval(getTime , 1000);
        return ()=>{clearInterval(clock)};
    },[globalHour])
    
    return (
        <p style={{ fontSize:'25px',marginBottom:0,marginLeft:8 }}>{ctime}</p>
    )
}

export default RealClock