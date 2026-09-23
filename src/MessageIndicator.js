import React, { useState, useEffect, useContext } from "react";
import { UserContext, socket } from "../App";
import useFetch from "../useFetch";
import { useNavigate } from "react-router-dom";

function MessageIndicator() {
  const [unreadData, setUnreadData] = useState({ totalUnread: 0, countBySender: {}, messages: [] });
  const { user, url } = useContext(UserContext);
  const navigate = useNavigate();

  const { get } = useFetch(`${url}/messages/unread/${user?.username}`);

  useEffect(() => {
    if (!user?.username) return;
    get((data) => {
      if (data) setUnreadData(data);
    });
  }, [user?.username]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (data.recieverId === user?.username) {
        setUnreadData((prev) => {
          const newTotal = prev.totalUnread + 1;
          const newCountBySender = {
            ...prev.countBySender,
            [data.senderId]: (prev.countBySender[data.senderId] || 0) + 1,
          };
          return {
            ...prev,
            totalUnread: newTotal,
            countBySender: newCountBySender,
            messages: [data, ...prev.messages],
          };
        });
      }
    };

    socket.on("recieve_message", handleReceiveMessage);

    return () => {
      socket.off("recieve_message", handleReceiveMessage);
    };
  }, [user?.username]);

  return (
    <div className="message-indicator-wrapper" onClick={() => navigate("/messages")} style={{ cursor: "pointer", position: "relative", display: "inline-block" }}>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {unreadData.totalUnread > 0 && (
        <span className="message-badge" style={{
          position: "absolute",
          top: "-5px",
          right: "-8px",
          background: "#ff4757",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "11px",
          fontWeight: "bold"
        }}>
          {unreadData.totalUnread > 9 ? "9+" : unreadData.totalUnread}
        </span>
      )}
    </div>
  );
}

export default MessageIndicator;