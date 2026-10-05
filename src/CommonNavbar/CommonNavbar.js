import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import './CommonNavbar.css'
import { UserContext } from '../App';
import NotificationIndicator from '../NotificationsIndicator/NotificationIndicator'; 
import LogoutIcon from '@mui/icons-material/Logout';

function CommonNavbar() {
  const {user} = useContext(UserContext)
  return (
    <div id="common-navbar">
        <nav>
          <h1 className="main-heading">Deeinder</h1>

          <div id="common-nav-icons">
          <Link to="/Home"><i className="fa-solid fa-house-chimney nav-icons"></i></Link>
          <NotificationIndicator />
          <Link to="/connections"><i className="fa-solid fa-users-rays nav-icons"></i></Link>

          <Link to="/messages"  id="msg-icon-link"><SendOutlinedIcon sx={{fontSize:"1.6em"}} id="msg-icon" className="nav-icons"/></Link>
          <Link to={"/userProfile/"+user.username}><i className="fa-solid fa-user nav-icons"></i></Link>
          {/* <Link><LogoutIcon sx={{fontSize:"2.5em"}}className="nav-icons"/></Link> */}
          </div>
        </nav>

        
    </div>
  )
}

export default CommonNavbar