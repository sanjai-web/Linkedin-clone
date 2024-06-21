// src/Chat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/chat.css"
const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    };

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchMessages = async (userId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3001/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(response.data);
  };

  const handleSendMessage = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:3001/messages', {
      receiverId: selectedUser._id,
      message,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage('');
    fetchMessages(selectedUser._id);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Users</h3>
        {users.map((user) => (
          <div key={user._id} onClick={() => handleUserClick(user)}>
            {user.firstName} {user.lastName}
          </div>
        ))}
      </div>
      <div className="chat-box">
        <h3>Chat</h3>
        {selectedUser && (
          <div>
            <div className="messages">
              {messages.map((msg) => (
                <div key={msg._id}>
                  <b>{msg.senderId === currentUser._id ? 'You' : selectedUser.firstName}:</b> {msg.message}
                </div>
              ))}
            </div>
            <div className="send-message">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;