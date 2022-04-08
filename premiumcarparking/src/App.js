import './App.css';

import React, { useEffect, useState } from 'react';
import Home from './pages/HomePage/Home';

import LoginForm from './pages/LoginPage/LoginForm'
import { SnackbarProvider } from 'notistack';

const AuthContext = React.createContext();

function App() {
  const [ auth , setAuth ] = useState(null);
  

  return (
    <AuthContext.Provider value={{ auth , setAuth }}>
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="App" 
        style={{
          
          height: auth ?'':'100vh',
          background: auth ?'':'linear-gradient(9deg,#012147,#00e7ff)'
      }}
      >
        {/* <Home/> */}
        {auth ? <Home/>:<LoginForm/>}
        
        </div>


      </SnackbarProvider>
    </AuthContext.Provider>
  );
}
export { AuthContext };
export default App;
