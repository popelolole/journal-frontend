import React from 'react';
import './message.css';

const Message = ({ message, isCurrentUser }) => {
  return (
    <div className={`message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      <div className="message-content">
        <p className="message-text">{message.message}</p>
      </div>
    </div>
  );
};

export default Message;
