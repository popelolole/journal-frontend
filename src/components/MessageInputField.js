import React, { useState } from 'react';
import './message.css';

const MessageInputField = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="input-field">
      <input
        type="text"
        placeholder="Type your message..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default MessageInputField;
