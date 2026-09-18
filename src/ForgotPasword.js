import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import emailjs from '@emailjs/browser';
import useFetch from './useFetch';
import { UserContext } from './App';

function ForgotPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [userEnteredCode, setUserEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const nav = useNavigate();
  const { url, setUser, setAuthUser } = useContext(UserContext);
  const checkEmailFetch = useFetch(`${url}/check-email`);
  const resetPasswordFetch = useFetch(`${url}/reset-password`);

  
  const handleCheckEmail = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    checkEmailFetch.post({ email }, async (data) => {
      try {
        
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);

        // TODO: Replace these with your teammate's actual EmailJS Service ID, Template ID, and Public Key
        await emailjs.send(
          'YOUR_SERVICE_ID', 
          'YOUR_TEMPLATE_ID', 
          {
            to_email: email,
            passcode: code,
          }, 
          'YOUR_PUBLIC_KEY'
        );

        setLoading(false);
        setStep(2); 
      } catch (err) {
        console.error('EmailJS Error:', err);
        setLoading(false);
        setErrorMessage('Failed to send verification email. Try again.');
      }
    });
  };

  
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (userEnteredCode === generatedCode) {
      setStep(3); 
    } else {
      setErrorMessage('Incorrect code. Check your inbox and try again.');
    }
  };

  
  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrorMessage('');

    resetPasswordFetch.post(
      { email, newPassword, confirmPassword },
      (data) => {
        const userObj = data.user;
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        setAuthUser(btoa(`${userObj.email}:${newPassword}`));
        
        nav('/Home');
        window.location.reload();
      }
    );
  };

  return (
    <div id="Login" className="main-bg">
      <h1 className="main-heading">Deeinder</h1>

      <div id="login-form">
        {step === 1 && (
          <form onSubmit={handleCheckEmail}>
            <h2 id="login-heading">Find Account</h2>
            <label htmlFor="reset-email">Email:</label>
            <input
              required
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <IconButton
              style={{ width: '100%', height: '50px', fontSize: '20px', backgroundColor: '#6215a3', color: '#fff', borderRadius: '10px', border: 'none', margin: '15px 0' }}
              variant="contained"
              type="submit"
            >
              {loading || checkEmailFetch.loading ? 'Sending Code...' : 'Send Code'}
            </IconButton>
            {(errorMessage || checkEmailFetch.error) && (
              <p id="display-error">{errorMessage || checkEmailFetch.error}</p>
            )}
            <p><Link to="/Login">Back to Login</Link></p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <h2 id="login-heading">Enter Code</h2>
            <p style={{ color: '#fff', fontSize: '14px', marginBottom: '15px' }}>
              We sent a 6-digit code to {email}.
            </p>
            <label htmlFor="verify-code">Verification Code:</label>
            <input
              required
              id="verify-code"
              type="text"
              value={userEnteredCode}
              onChange={(e) => setUserEnteredCode(e.target.value)}
            />
            <IconButton
              style={{ width: '100%', height: '50px', fontSize: '20px', backgroundColor: '#6215a3', color: '#fff', borderRadius: '10px', border: 'none', margin: '15px 0' }}
              variant="contained"
              type="submit"
            >
              Verify Code
            </IconButton>
            {errorMessage && <p id="display-error">{errorMessage}</p>}
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 id="login-heading">New Password</h2>
            <label htmlFor="new-password">New Password:</label>
            <input
              required
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              required
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <IconButton
              style={{ width: '100%', height: '50px', fontSize: '20px', backgroundColor: '#6215a3', color: '#fff', borderRadius: '10px', border: 'none', margin: '15px 0' }}
              variant="contained"
              type="submit"
            >
              {resetPasswordFetch.loading ? 'Updating...' : 'Reset Password'}
            </IconButton>
            {resetPasswordFetch.error && <p id="display-error">{resetPasswordFetch.error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;