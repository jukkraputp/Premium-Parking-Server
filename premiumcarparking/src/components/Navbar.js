import React,{ useContext, useEffect ,useState } from 'react'
import './Navbar.css'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { AuthContext } from '../App'
import ScrollReveal from 'scrollreveal'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '../configfirebase'
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

function Navbar() {
    const { auth ,setAuth } = useContext(AuthContext);
    const { enqueueSnackbar , closeSnackbar } = useSnackbar();
    const [ showMenuIcon, setShowMenuIcon ] = useState(false);
    const [ menuIconClick , setMenuIconClick ] = useState(false);
    const slideFromTop = {
        distance: '100px',
        origin: 'top',
        opacity: '0',
        duration: 1200,
        reset:false,
    };
    useEffect(()=>{
        ScrollReveal().reveal('.navbar',slideFromTop);
    },[])
    

    function Notification(type , message){
        enqueueSnackbar( message,{ 
            variant: type,
            action: (key) => (
                    <Button size='small'  onClick={() => closeSnackbar(key)}>
                        Dismiss
                    </Button>
            ) 
        });
    }

    async function Logout(){
        try{
            await signOut(firebaseAuth);
            Notification('info','Logout');
            setAuth(null);
        }catch(err){
            Notification('error',err.message);
            console.log(err);
        }   
    }

    return (
        <>
            <div className='navbar'>
                <div className='logo'>
                    <p style={{marginBottom:0 ,color:'#09c6f9' ,fontFamily:"'Sansita Swashed', cursive"}}>Premium</p><p style={{marginBottom:0 , color:'rgb(8 48 112)',fontFamily:"'Sansita Swashed', cursive"}}>Parking</p>
                </div>     
                <div className='info-and-logout' >
                    <p> {auth ? auth.username : 'username'} </p>
                    <div  className='logout-button' onClick={Logout}>
                        <ExitToAppIcon/>
                        <p>Logout</p>
                    </div>
                </div>
                <Button className='MenuButton' onClick={()=>setMenuIconClick(!menuIconClick)}>
                    {menuIconClick ? 
                        <CloseIcon style={{fontSize:'28px'}}/>                
                    :
                        <MenuIcon style={{fontSize:'28px'}}/>
                    }
                </Button>
                
            </div>
            <div className='menu-container' style={{top:`${menuIconClick ? '70px': '-120px'}`}}>
                <div style={{paddingTop:'20px'}}>
                    <p style={{marginLeft:'60px',fontSize:17 , fontWeight:600}}> {auth ? auth.username : 'username'} </p>
                </div>
                <div style={{paddingTop:'10px',paddingBottom:'20px'}}>
                    <div  className='logout-button' style={{marginLeft:'60px'}} onClick={Logout}>
                        <ExitToAppIcon/>
                        <p>Logout</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar