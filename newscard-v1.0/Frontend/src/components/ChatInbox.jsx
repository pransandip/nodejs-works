import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import ChatInput from './ChatInput';
import {
  fetchChatMessagesData,
  sendChatMessage,
} from '../services/chatService';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/reducers/authSlice';
const styles = {
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderBottom: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
  },
  chatMessages: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    maxHeight: 'calc(100vh - 328px)', // Adjust the value according to your layout
    overflowY: 'auto', // Add vertical scrollbar if content exceeds maxHeight
  },
  messageContainerSender: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    justifyContent: 'flex-end', // Align sender's message to the right
  },
  messageContainerReceiver: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    justifyContent: 'flex-start', // Align receiver's message to the left
  },
  senderMessage: {
    backgroundColor: '#B7417D',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    maxWidth: '70%',
    marginLeft: '8px', // Add margin to separate avatar and message
  },
  receiverMessage: {
    backgroundColor: '#8758BE',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    maxWidth: '70%',
    marginLeft: '8px', // Add margin to separate avatar and message
  },
  avatar: {
    marginRight: '8px', // Add margin for spacing between avatar and message
  },
};

const ChatInbox = (props) => {
  const auth = useSelector(selectAuth);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const sendMessage = async (event) => {
    event.preventDefault();
    if (message) {
      const result = await sendChatMessage({
        senderId: auth.user.id,
        receiverId: props.receiver.id,
        message: message,
        docUrl: '',
        messageType: 'TEXT',
      });
      getChatMessages();
      setMessage('');
    }
  };
  const getChatMessages = async () => {
    const messagesdata = await fetchChatMessagesData({
      senderId: auth.user.id,
      receiverId: props.receiver.id,
    });
    console.log(messagesdata);
    setMessageList(messagesdata.data);
  };
  useEffect(() => {
    getChatMessages();
  }, [props]);
  useEffect(() => {
    if (props.newMessage) {
      if (props.receiver === props.newMessage.receiverId) {
        setMessageList((data) => [...data, props.newMessage]);
      }
    }
  }, [props.newMessage, props.receiver]);
  return (
    <div>
      <div style={styles.chatHeader}>
        <div style={styles.avatar}>
          <Avatar
            alt={`${props.receiver.firstname} ${props.receiver.lastname}`}
            src={props.receiver.image}
          />
        </div>
        <span>{`${props.receiver.firstname} ${props.receiver.lastname}`}</span>
      </div>
      <div style={styles.chatMessages}>
        {messageList.map((message, index) => (
          <div
            key={index}
            style={
              message?.senderId === auth.user.id
                ? styles.messageContainerSender
                : styles.messageContainerReceiver
            }
          >
            {message?.senderId === auth.user.id ? (
              <div style={styles.senderMessage}>
                <div dangerouslySetInnerHTML={{ __html: message?.message }} />
              </div>
            ) : (
              <>
                <div style={styles.avatar}>
                  <Avatar
                    alt={`${message.receiver.firstname} ${props.receiver.lastname}`}
                    src={`${message.receiver.image}`}
                  />
                </div>
                <div style={styles.receiverMessage}>
                  <div dangerouslySetInnerHTML={{ __html: message?.message }} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div>
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatInbox;
