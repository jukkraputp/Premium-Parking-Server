import React, { useContext, useEffect, useRef, useState ,Fragment } from 'react'
import { AuthContext } from '../../App'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockIcon from '@material-ui/icons/Lock';
import ScrollReveal from 'scrollreveal'
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {motion,AnimatePresence } from 'framer-motion'
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';
import { db,firebaseAuth } from '../../configfirebase';
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword,onAuthStateChanged ,signOut} from 'firebase/auth';
import { collection, addDoc , doc ,onSnapshot, setDoc} from 'firebase/firestore'
import './LoginForm.css';

function LoginForm() {
    const { auth , setAuth } = useContext(AuthContext);
    const [selectedLogin , setSelectedLogin] = useState(true);
    const { enqueueSnackbar , closeSnackbar } = useSnackbar();
    const loginUsernameRef = useRef();
    const loginPasswordRef = useRef();
    const signupUsernameRef = useRef();
    const signupPasswordRef = useRef();
    const singupConfirmPasswordRef = useRef();
    const signupRfidRef = useRef();

    const slideFromTop = {
        distance: '80px',
        origin: 'top',
        opacity: '0',
        duration: 2000,
        reset:false,
    };

    useEffect(()=>{
        ScrollReveal().reveal('.login-signup-form' , slideFromTop)
        
        //real time update
        // onSnapshot(colRef, (snapshot) => {
        //     snapshot.docs.forEach((doc) => {
        //         console.log(doc.data())
        //     })
        // })
    },[])
    
    useEffect(()=>{
        let unsubscribe = onAuthStateChanged(firebaseAuth,(res)=>{
            if( selectedLogin&& !!res  ){
                setAuth({username: res.email })
            }
            
        });
        return ()=>unsubscribe();
    },[selectedLogin])

    async function AddToCollection(collection, documentID, json) {
        const docRef = doc(db, collection, documentID);
        await setDoc(docRef, json);
    }

    async function Login(e){
        e.preventDefault();
        try{
            const res = await signInWithEmailAndPassword(firebaseAuth , loginUsernameRef.current.value , loginPasswordRef.current.value);
            // console.log(res.user);
            setAuth({username:  res.user.email })
        }catch(err){
            Notification('error',err.message);
        }
        
    }

    async function Signup(e){
        e.preventDefault();
        if( signupPasswordRef.current.value === singupConfirmPasswordRef.current.value ){
            try{
                const user = await createUserWithEmailAndPassword(firebaseAuth , signupUsernameRef.current.value , signupPasswordRef.current.value);  
                await signOut(firebaseAuth);
                await AddToCollection("Users", signupUsernameRef.current.value, {end_date:false,reserved: false, rfid: signupRfidRef.current.value,start_date:false})
                Notification('success','Signup success');
                setSelectedLogin(true);
                
            }
            catch(err){
                console.log(err);
                Notification('error',err.message);
            }
        }
        else{
            Notification('error','Password miss matched');
        }
        
    }
    
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

    function loginMode(){
        setSelectedLogin(true);
        signupUsernameRef.current.value = null;
        signupPasswordRef.current.value = null;

    }

    function signupMode(){
        setSelectedLogin(false);
        loginUsernameRef.current.value = null;
        loginPasswordRef.current.value = null;
    }

    return (
        <div className='login-signup-form'>
            {/* <button onClick={(e)=>Signup(e)}>กด</button> */}
            <div className='login-container' style={{height: selectedLogin ? '540px' : '700px'}}>
                <AnimatePresence>
                    {selectedLogin ? <motion.h1 
                    layout
                    animate={{opacity : 1}}
                    initial={{opacity : 0}}
                    exit = {{opacity : 0}}
                    style={{width:'250px',display:'flex' , justifyContent:'space-between' ,alignItems:'center'}}
                    ><p style={{marginBottom:0 ,color:'#09c6f9' ,fontFamily:"'Sansita Swashed', cursive"}}>Premium</p><p style={{marginBottom:0 , color:'rgb(8 48 112)',fontFamily:"'Sansita Swashed', cursive"}}>Parking</p></motion.h1> : 
                    <motion.h1 layout
                        animate={{opacity : 1}}
                        initial={{opacity : 0}}
                        exit = {{opacity : 0}}
                        style={{width:'250px',display:'flex' , justifyContent:'space-between' ,alignItems:'center'}}
                    ><p style={{marginBottom:0 ,color:'#09c6f9' ,fontFamily:"'Sansita Swashed', cursive"}}>Premium</p><p style={{marginBottom:0 , color:'rgb(8 48 112)',fontFamily:"'Sansita Swashed', cursive"}}>Parking</p></motion.h1>}
                </AnimatePresence>

                <div className='selected-login-and-signup-button'>
                    <div className={`selected-mode-button ${selectedLogin ? 'active' : ''} `}
                        onClick={loginMode}
                    >
                        <h3>Login</h3>
                    </div>
                    <div className={`selected-mode-button ${selectedLogin ? '' : 'active'}`}
                        onClick={signupMode}
                    >
                        <h3>Signup</h3>
                    </div>
                    
                    
                </div>
                
                { selectedLogin ?
                        <form className='login-form' onSubmit={(e)=>Login(e)}>
                            <div className='login-form-email'>
                                <h5>Email Address</h5>
                                <div className='form-email-password'>
                                    <MailOutlineIcon style={{color: '#0000005c' , marginLeft:'5px'}}/>
                                    <input type="email" autoComplete='off' placeholder='Type your email' ref={loginUsernameRef} required/>
                                </div>
                            </div>
                            <div className='login-form-password'>
                                <h5>Password</h5>
                                <div className='form-email-password'>
                                    <LockIcon style={{color: '#0000005c' , marginLeft:'5px'}}/>
                                    <input type='password' autoComplete='off' placeholder='Type your password' ref={loginPasswordRef} required/>
                                </div>
                            </div>
                            <motion.button 
                            type="submit"
                            animate={{opacity : 1}}
                            initial={{opacity : 0}}
                            exit = {{opacity : 0}}
                            className='login-signup-button'>
                                <h3>Login</h3>
                            </motion.button>
                        </form>:
                        <form className='signup-form' onSubmit={(e)=>{Signup(e)}} >
                            <div className='signup-form-detail'>
                                <h5>Email Address</h5>
                                <div className='form-details'>
                                    <MailOutlineIcon style={{color: '#0000005c' , marginLeft:'5px'}}/>
                                    <input type="email" placeholder='Type your email' ref={signupUsernameRef} required/>
                                </div>
                            </div>
                            <div className='signup-form-detail'>
                                <h5>Password</h5>
                                <div className='form-details'>
                                    <LockIcon style={{color: '#0000005c' , marginLeft:'5px'}}/>
                                    <input type='password' autoComplete='off' placeholder='Create your password' ref={signupPasswordRef} required/>
                                </div>
                            </div>
                            <div className='signup-form-detail'>
                                <h5>Confirm your password</h5>
                                <div className='form-details'>
                                    <EnhancedEncryptionIcon style={{color: '#0000005c' , marginLeft:'5px'}}/>
                                    <input type='password' autoComplete="off" placeholder='Type your password again' ref={singupConfirmPasswordRef} required/>
                                </div>
                            </div>
                            <div className='signup-form-detail'>
                                <h5>RFID Tag</h5>
                                <div className='form-details'>
                                    <LocalOfferIcon style={{color: '#0000005c' , marginLeft:'5px'}}/>
                                    <input placeholder='ex. xccs-sdsd' ref={signupRfidRef} required/>
                                </div>
                            </div>
                            <motion.button
                            type='submit'
                            animate={{opacity : 1}}
                            initial={{opacity : 0}}
                            exit = {{opacity : 0}}
                            className='login-signup-button'>
                                <h3>Signup</h3>
                            </motion.button>
                        </form>   
                    }
                
                
            </div>

        </div>
    )
}

export default LoginForm