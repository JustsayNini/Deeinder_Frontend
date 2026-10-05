import React, { useState, useEffect, useContext } from "react";
import { UserContext, socket } from "../App";
import useFetch from "../useFetch";
import { useNavigate } from "react-router-dom";
import "./NotificationIndicator.css";

function NotificationIndicator() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, url } = useContext(UserContext);
  const navigate = useNavigate();

  const { get } = useFetch(`${url}/notifications/${user?.username}`);

  useEffect(() => {
    if (!user?.username) return;
    get((data) => {
      if (data) {
        const unread = data.filter((item) => item.is_read === false).length;
        setUnreadCount(unread);
      }
    });
  }, [user?.username]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveNotification = (data) => {
      if (data.recipient === user?.username) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("receive_notification", handleReceiveNotification);

    return () => {
      socket.off("receive_notification", handleReceiveNotification);
    };
  }, [user?.username]);

  return (
    <div 
      className="notification-indicator-wrapper" 
      onClick={() => navigate("/notifications")}
    >
      <i className="fa-solid fa-bell nav-icons"></i>

      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
}

export default NotificationIndicator;