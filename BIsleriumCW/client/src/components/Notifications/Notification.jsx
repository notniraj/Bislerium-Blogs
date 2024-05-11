import React, { useState, useEffect } from "react";
import axios from "axios";

import * as signalR from "@microsoft/signalr";

const Notification = () => {
  const [user, setUser] = useState();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // establishing the connection to SignalR hub
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7212/notify')
      .build();

    // Starting the connection
    connection.start()
      .then(() => {
        console.log('SignalR Connected');
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    // Listening for incoming messages
    connection.on('SendMessage', (user, notification) => {
      // Updating state with new notification
      setNotifications(prevNotifications => [
        ...prevNotifications,
        { user, notification }
      ]);
    });

    // Cleaning up connection on unmount
    return () => {
      connection.stop();
    };
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.post(
        `https://localhost:7212/api/blog/{blogId}/upvote`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  return (
    <>
      <div>Notification</div>
      <div>
        <button onClick={fetchUserBlogs}>Get Test Result</button>
      </div>
      <div>
        <h1>SignalR Client</h1>
        <ul>
        {notifications.map((notif, index) => (
          <li key={index}>
            <strong>{notif.user}:</strong> {notif.notification}
          </li>
        ))}
      </ul>
      </div>
    </>
  );
};

export default Notification;
