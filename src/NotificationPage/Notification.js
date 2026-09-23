import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import useFetch from "../useFetch";
import "./Notification.css";

function Notification() {
  const [activeTab, setActiveTab] = useState("NEW");
  const [notifications, setNotifications] = useState([]);
  
  const { user, url, authUser } = useContext(UserContext);

  const { get, loading } = useFetch(
    `${url}/notifications/${user?.username}`
  );

  useEffect(() => {
    if (!user?.username) return;
    get((data) => {
      setNotifications(data || []);
    });
  }, [user?.username]);

  const handleMarkAsRead = (id) => {
    fetch(`${url}/notifications/read/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `basic ${localStorage.getItem("authUser") || authUser}`
      }
    })
      .then((res) => res.json())
      .then(() => {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_read: true } : item
          )
        );
      })
      .catch((err) => console.error("Error marking read:", err));
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "NEW") return notification.is_read === false;
    if (activeTab === "OLD") return notification.is_read === true;
    return true;
  });

  const getTimelinePeriod = (timestamp) => {
    if (!timestamp) return "OLDER";
    const createdDate = new Date(timestamp);
    const today = new Date();

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const createdDateOnly = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      createdDate.getDate()
    );

    const diffTime = todayDate - createdDateOnly;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "TODAY";
    if (diffDays === 1) return "YESTERDAY";
    if (diffDays <= 7) return "THIS WEEK";

    return "OLDER";
  };

  const todayItems = filteredNotifications.filter(
    (item) => getTimelinePeriod(item.created_at) === "TODAY"
  );
  const yesterdayItems = filteredNotifications.filter(
    (item) => getTimelinePeriod(item.created_at) === "YESTERDAY"
  );
  const thisWeekItems = filteredNotifications.filter(
    (item) => getTimelinePeriod(item.created_at) === "THIS WEEK"
  );
  const olderItems = filteredNotifications.filter(
    (item) => getTimelinePeriod(item.created_at) === "OLDER"
  );

  const unreadCount = notifications.filter(
    (item) => item.is_read === false
  ).length;

  return (
    <div className="notification-page">
      <div className="notification-header">
        <div className="notification-title-wrapper">
          <div className="notification-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M10 21h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          <div>
            <h1>Notifications</h1>
            <p>Stay up to date with your activity</p>
          </div>
        </div>
      </div>

      <div className="notification-tabs">
        <button
          className={activeTab === "NEW" ? "active" : ""}
          onClick={() => setActiveTab("NEW")}
        >
          NEW
          {unreadCount > 0 && <span className="tab-count">{unreadCount}</span>}
        </button>

        <button
          className={activeTab === "ALL" ? "active" : ""}
          onClick={() => setActiveTab("ALL")}
        >
          ALL
        </button>

        <button
          className={activeTab === "OLD" ? "active" : ""}
          onClick={() => setActiveTab("OLD")}
        >
          OLD
        </button>
      </div>

      <div className="notification-list">
        {loading && (
          <div className="notification-state">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <div className="notification-state empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24">
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M10 21h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3>No notifications</h3>
            <p>You don't have any notifications in this category yet.</p>
          </div>
        )}

        {!loading && todayItems.length > 0 && (
          <NotificationGroup
            title="TODAY"
            items={todayItems}
            onRead={handleMarkAsRead}
          />
        )}

        {!loading && yesterdayItems.length > 0 && (
          <NotificationGroup
            title="YESTERDAY"
            items={yesterdayItems}
            onRead={handleMarkAsRead}
          />
        )}

        {!loading && thisWeekItems.length > 0 && (
          <NotificationGroup
            title="THIS WEEK"
            items={thisWeekItems}
            onRead={handleMarkAsRead}
          />
        )}

        {!loading && olderItems.length > 0 && (
          <NotificationGroup
            title="OLDER"
            items={olderItems}
            onRead={handleMarkAsRead}
          />
        )}
      </div>
    </div>
  );
}

function NotificationGroup({ title, items, onRead }) {
  return (
    <section className="notification-group">
      <div className="group-heading">
        <span>{title}</span>
        <div className="group-line"></div>
      </div>

      <div className="group-items">
        {items.map((item) => (
          <NotificationCard key={item.id} item={item} onRead={onRead} />
        ))}
      </div>
    </section>
  );
}

function NotificationCard({ item, onRead }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitial = () => {
    return item.sender_username?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <div
      className={`notification-card ${!item.is_read ? "unread" : ""}`}
      onClick={() => {
        if (!item.is_read) onRead(item.id);
      }}
    >
      {!item.is_read && <span className="unread-dot"></span>}

      <div className="notification-avatar">
        {item.actor_pfp ? (
          <img src={item.actor_pfp} alt="" />
        ) : (
          <span>{getInitial()}</span>
        )}
      </div>

      <div className="notification-content">
        <div className="notification-message">
          <strong>{item.sender_username || "Someone"}</strong>
          <p>{item.content}</p>
        </div>

        <span className="notification-time">{formatTime(item.created_at)}</span>
      </div>

      {item.type === "connect" && (
        <div className="notification-actions">
          <button className="accept-btn">Accept</button>
          <button className="decline-btn">Decline</button>
        </div>
      )}
    </div>
  );
}

export default Notification;