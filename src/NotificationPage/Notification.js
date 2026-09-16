import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App"; 
import { supabase } from "../supabaseClient"; // Adjust this import path to match your project structure
import "./Notification.css";

function Notification() {
  const [activeTab, setActiveTab] = useState("NEW");
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(UserContext);

  //fetch live notifications from Supabase
  useEffect(() => {
    async function fetchNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("username", user.username) // Only get notifications targeting the logged-in user
        .order("created_at", { ascending: false }); // Newest items first

      if (!error && data) {
        setNotifications(data);
      } else if (error) {
        console.error("Error fetching notifications:", error);
      }
    }

    if (user?.username) {
      fetchNotifications();
    }
  }, [user]);

  //filter notifications based on the active sub-navbar tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "NEW") return notif.is_read === false;
    if (activeTab === "OLD") return notif.is_read === true;
    return true;
  });

  //helper function to categorize timestamps into TODAY, YESTERDAY, THIS WEEK
  const getTimelinePeriod = (timestampString) => {
    const createdDate = new Date(timestampString);
    const today = new Date();
    
    //clear hours to compare calendar dates accurately
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const createdDateOnly = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
    
    const diffTime = todayDateOnly - createdDateOnly;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "TODAY";
    if (diffDays === 1) return "YESTERDAY";
    if (diffDays <= 7) return "THIS WEEK";
    return "OLDER";
  };

  //sort filtered items into their chronological timeline buckets
  const todayItems = filteredNotifications.filter(item => getTimelinePeriod(item.created_at) === "TODAY");
  const yesterdayItems = filteredNotifications.filter(item => getTimelinePeriod(item.created_at) === "YESTERDAY");
  const thisWeekItems = filteredNotifications.filter(item => getTimelinePeriod(item.created_at) === "THIS WEEK" || getTimelinePeriod(item.created_at) === "OLDER");

  return (
    <div className="notification-page">
      {/* Sub-navbar tabs based on your mockup */}
      <div className="notification-navbar">
        <button className={activeTab === "NEW" ? "active" : ""} onClick={() => setActiveTab("NEW")}>NEW</button>
        <button className={activeTab === "ALL" ? "active" : ""} onClick={() => setActiveTab("ALL")}>ALL</button>
        <button className={activeTab === "OLD" ? "active" : ""} onClick={() => setActiveTab("OLD")}>OLD</button>
      </div>

      <div className="notification-list">
        {/* Today Block */}
        {todayItems.length > 0 && (
          <div className="time-group">
            <h3>TODAY</h3>
            <hr />
            {todayItems.map(item => <NotificationCard key={item.id} item={item} />)}
          </div>
        )}

        {/* Yesterday Block */}
        {yesterdayItems.length > 0 && (
          <div className="time-group">
            <h3>YESTERDAY</h3>
            <hr />
            {yesterdayItems.map(item => <NotificationCard key={item.id} item={item} />)}
          </div>
        )}

        {/* This Week Block */}
        {thisWeekItems.length > 0 && (
          <div className="time-group">
            <h3>THIS WEEK</h3>
            <hr />
            {thisWeekItems.map(item => <NotificationCard key={item.id} item={item} />)}
          </div>
        )}

        {filteredNotifications.length === 0 && (
          <p className="no-notifications">No notifications found in this category.</p>
        )}
      </div>
    </div>
  );
}

//reusable card structure mapped to your actual database column layout
function NotificationCard({ item }) {
  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`notification-card ${!item.is_read ? "unread-highlight" : ""}`}>
      <div className="avatar-placeholder"></div>
      <div className="card-info">
        <strong>{item.actor_username}</strong>
        <p>{item.content}</p>
        <span>{formatTime(item.created_at)}</span>
      </div>
      {item.type === "connect" && (
        <div className="action-buttons">
          <button className="accept-btn">Accept</button>
          <button className="decline-btn">Decline</button>
        </div>
      )}
    </div>
  );
}

export default Notification;
