import Navbar from "./Navbar/Navbar";
import "./App.css";
import UserProfile from "./MemberProfile/UserProfile";
import MembersContext from "./Context/MembersContext";
import SplashScreen from "./SplashScreen";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import useFetch from "./useFetch";
import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./HomePage/Home";
import MemberProfile from "./MemberProfile/MemberProfile";
import CommonNavbar from "./CommonNavbar/CommonNavbar";
import ConnectionRequests from "./Connections/Connections";
import Messages from "./Messages/Messages";
import MessagingContext from "./Context/MessagingContext";
import io from "socket.io-client"
import AboutUs from "./T&Cs/AboutUs";
import TermsAndConditions from "./T&Cs/TermsAndConditions";
import PrivacyPolicy from "./T&Cs/PrivacyPolicy";
import Notification from "./NotificationPage/Notification";

export const socket = io.connect("https://deeinder-backend.onrender.com")

export const UserContext = React.createContext();


function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || ""
  );
  const [authUser,setAuthUser] = useState(btoa(`${user.email}:${user.password}`))
  const url = "https://deeinder-backend.onrender.com";


  function ProtectedRoutes({ element }) {
    if (!user) {
      alert("Please login");
      return <Navigate to="/Login" />;
    } else {
      return element;
    }
  }
  return (
    <Router>
      <div className="App">
        <div className="content">
          <UserContext.Provider value={{ setAuthUser,user, setUser, url,authUser }}>
            <MembersContext>
              <MessagingContext>

              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <>
                      <Navbar />
                      <SplashScreen />
                    </>
                  }
                />

                <Route exact path="/Login" element={<Login />} />

                <Route exact path="/SignUp" element={<SignUp />} />
                 <Route
                  exact
                  path="/AboutUs"
                  element={<AboutUs />}
                />
                 <Route
                  exact
                  path="/T&Cs"
                  element={<TermsAndConditions />}
                />
                <Route
                  exact
                  path="/PrivacyPolicy"
                  element={<PrivacyPolicy/>}
                />

                <Route
                  exact
                  path="/Home"
                  element={<ProtectedRoutes element={<Home />} />}
                />
                <Route
                  exact
                  path="/MemberProfile/:username"
                  element={<ProtectedRoutes element={<MemberProfile />} />}
                />
                <Route
                  exact
                  path="/userProfile/:user"
                  element={<ProtectedRoutes element={<UserProfile />} />}
                />

                <Route
                  exact
                  path="/connections"
                  element={<ProtectedRoutes element={<ConnectionRequests />} />}
                />

                <Route
                  exact
                  path="/messages"
                  element={<ProtectedRoutes element={<Messages />} />}
                />

                <Route
                  exact
                  path="/notifications"
                  element={
                  <ProtectedRoutes
                   element={
                   <>
                    <CommonNavbar />
                    <Notification />
                   </>
                   }
                    />
                  }
                />

              </Routes>
              </MessagingContext>
            </MembersContext>
          </UserContext.Provider>
        </div>
      </div>
    </Router>
  );
}

export default App;
