import React from 'react';

const ChatMessage = ({ message }) => {
  const messageClass = `message ${message.sender === 'me' ? 'outgoing' : 'incoming'} ${message.isToxic ? 'toxic' : ''}`;

  return (
    <div className={messageClass}>
      <div className="message-content">
        {message.text}
      </div>
      {message.isToxic && (
        <span className="toxic-badge">Flagged</span>
      )}
    </div>
  );
};

export default ChatMessage;