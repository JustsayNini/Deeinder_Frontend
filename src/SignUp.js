import React from 'react'
import { useState, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { compose, display, flexDirection, fontSize, height, margin, maxHeight, textAlign } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useFetch from './useFetch';
import { UserContext } from './App';

function SignUp() {
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [pfp, setPfp] = useState('emptyPfp.png')
  const [pfpFile, setFile] = useState('')

  const { url } = useContext(UserContext);
  const nav = useNavigate();

  let today = new Date();
  let todayDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${(today.getDate()).toString().padStart(2, "0")}`

  const { postMediaNoAuth, result, loading } = useFetch(`${url}/signUp`);
  const { user, setUser } = useContext(UserContext);

  function handleSignUp(e) {
    e.preventDefault();

    const formData = new FormData();
    const details = { fullName, username, email, password, confirmPassword, gender, dob };
    formData.append(`pfp`, pfpFile);
    formData.append("details", JSON.stringify(details))
    console.log(pfpFile)

    postMediaNoAuth(formData, (d) => {
      //Only navigate and save session if the backend response does not contain errors
      if (d && !d.error) {
        localStorage.setItem("user", JSON.stringify(d));
        setUser(d)
        nav('/Home');
      }
    })
  }

  return (
    <div id="SignUp" className="main-bg">
      <h1 className="main-heading">Deeinder</h1>

      <form method="POST" action={url} encType="multipart/form-data" onSubmit={handleSignUp}>
        <h2 id="signup-heading">Sign Up</h2>

        <div id="signup-form">
          <div id="right">
            <div id="upload-pfp">
              <Button
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', color: 'white' }}
                component="label"
                role={undefined}
                tabIndex={-1}
              >
                <img id="pfp-img" src={pfp} style={{ objectFit: "fill", width: "230px", height: "166px", clipPath: "circle()", color: 'gray' }}></img>
                Upload Profile Picture
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files[0] // FIXED: Added missing index selector to pull file reference accurately
                    setFile(file);
                    const imgUrl = URL.createObjectURL(file)
                    setPfp(imgUrl)
                  }}
                  name='pfp'
                  id='pfp'
                />
              </Button>
            </div>

            <label>Full Name:</label>
            <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}></input>

            <label >Username:</label>
            <input required type="text" value={username} onChange={(e) => setUsername(e.target.value.replaceAll(" ", ""))}></input>

            <label>Gender:</label>
            <div id="genders">
              <div id="male-cont">
                <input required className="gender" id="male" name="gender" type="radio" value="M" onChange={(e) => setGender(e.target.value)}></input>
                <label htmlFor="male">Male</label>
              </div>

              <div id="female-cont">
                <input required className="gender" id="female" name="gender" type="radio" value="F" onChange={(e) => setGender(e.target.value)}></input>
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>

          <div id="left">
            <label>Email:</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value.replaceAll(" ", ""))}></input>

            <label>Password:</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

            <label>Confirm Password:</label>
            <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>

            <label>Date Of Birth:</label>
            <input min="1900-01-01" max={todayDate} required type="date" value={dob} onChange={(e) => setDob(e.target.value)}></input>

            <div id="ts-cs">
              <input required id="ts-cs-ch" type="checkbox"></input>
              <label htmlFor="ts-cs-ch">I accept the <Link to="/T&Cs">terms&conditions</Link></label> {/* UPDATED: Linked path route directly onto your existing /T&Cs link */}
            </div>
          </div>
        </div>

        {result && <p id="display-error">{result.error}</p>}

        <IconButton
          style={{
            width: '300px',
            height: '50px',
            fontSize: '20px',
            color: 'gray',
            backgroundColor: '#6215a3',
            borderRadius: '10px',
            border: 'none',
            margin: '10px 0 10px 0'
          }}
          type="submit"
          variant="contained"
          loading={loading}
        >
          Sign Up
        </IconButton>
        
        <p>Already have an account? <Link to="/Login">Log In</Link></p>
      </form>
    </div>
  )
}

export default SignUp
