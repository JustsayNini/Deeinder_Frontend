import React, { useContext } from 'react'
import { Link,useNavigate} from 'react-router-dom'
import {useState} from 'react'
import IconButton from '@mui/material/IconButton';
import usePost from './usePost';
import useFetch from './useFetch';
import { UserContext } from './App';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")
  const nav = useNavigate();
  const {url,setUser,setAuthUser} = useContext(UserContext)
  const {postNoAuth,result,loading,error} = useFetch(`${url}/Login`);
   
  
  function handleLogin() {
  const cred = {email,password};
  
  postNoAuth(cred,(d)=>{
    localStorage.setItem("user",JSON.stringify(d));
    
    setUser(d);
    setAuthUser(btoa(`${d.email}:${d.password}`));
    nav('/Home');
    window.location.reload();
   
  });

    
  }

  return (
    <div id="Login" className="main-bg">
        <h1 className="main-heading">Deeinder</h1>



        <div id="login-form">

          <form>
             <h2 id="login-heading">Login</h2>

             <label htmlFor="login-email">Email:</label>
             <input required id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>

             <label htmlFor="login-password">Password:</label>
             <input required id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
           

         
             <IconButton style={{ width: '100%',
                                  height: '50px',
                                  fontSize: '20px',
                                  backgroundColor: '#6215a3',
                                  borderRadius: '10px',
                                  border: 'none',
                                  margin: '10px 0 10px 0'}}
                        variant="contained" onClick={handleLogin} loading={loading}>
              Login
             </IconButton>
             

             

             
          </form>
           {<p id="display-error">{error}</p>}
          <p>Don't have an account? <Link to="/SignUp">Sign Up</Link></p>
          <p style={{ marginTop: '10px' }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>

        </div>
        
    </div>
  )
}

export default Login