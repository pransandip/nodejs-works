import React, { useEffect, useState } from 'react';

import {
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  createTheme,
  Container,
  Box,
} from '@mui/material';
import { createStyles, ThemeProvider } from '@mui/material/styles';
import ChatInbox from './ChatInbox';
import {fetchUsersListData} from '../services/chatService';
import { selectAuth } from '../redux/reducers/authSlice';
import { useSelector } from 'react-redux';
const styles = {
  root: {
    flexGrow: 1,
    padding: 2
  },
  chatListPanel: {
    maxHeight: '100vh',
    overflowY: 'auto',
    borderRight: 1,
  },
  chatInbox: {
    minHeight: '100vh',
    'padding-left': 0,
  },
};

const ChatComponent = (props) => {
  const auth = useSelector(selectAuth);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUserList, setChatUserList] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const handleChatItemClick = (chat) => {
    setSelectedChat(chat.id);
    setReceiver(chat);
  };

  const getUserListHandler = async ()=>{
    const users = await fetchUsersListData();
    setChatUserList(users.data);
    getTotalNotificationCount();
  }
  const viewMessages = (userId)=>{
    setChatUserList([...chatUserList.map((e)=>{
      if(e.id===userId)
      {
        if(e.chatNotifications.length>0)
        {
          const data = e.chatNotifications?.find((f)=>f.email===auth.user.email);
          if(data!==undefined)data.notificationCount = 0;
        }
      }
      return e;
    })]);
  }
  useEffect(()=>{
    getUserListHandler();
  },[props.messageNotification]);
  const getNotificationCount =  (chatNotifications)=>{
    const data = chatNotifications?.find((f)=>f.email===auth.user.email);
    if(data!==undefined)
    {
      console.log(data.notificationCount);
      return data.notificationCount;
    }else{
      return 0;
    }
    
  }

  const getTotalNotificationCount = ()=>{
    let total = 0;
    chatUserList.map((e)=>{
      const data = e.chatNotifications?.find((f)=>f.email===auth.user.email);
      if(data!==undefined)
      {
        total = total + data.notificationCount;
      }
    })
    props.setMessageNotificationCount(total);
    
  }
  // 

  return (
    <Container
      style={{
        padding: '0 0',
        transitionProperty: 'margin',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'ease-in-out',
      }}
      maxWidth="lg"
      sx={{
        // marginLeft: open ? '15px' : '100px',
        marginTop: '30px',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 2,
          flexGrow: 1,
        }}
        component="div"
      >
        <div style={styles.root}>
          <Grid container spacing={2}>
            <Grid item xs={4} style={styles.chatListPanel}>
              <Paper
                elevation={3}
                sx={{
                  borderRight: '1px solid #ccc',
                  borderRadius: 0,
                  backgroundColor: '#f0f0f0',
                }}
              >
                <List>
                  {chatUserList.filter((f)=>f.id!==auth.user.id).map((chat) => (
                    <ListItem
                      key={chat.id}
                      button
                      onClick={() => {handleChatItemClick(chat);viewMessages(chat.id)}}
                      selected={selectedChat === chat.id}
                    >
                      <ListItemAvatar>
                        <Avatar alt={`${chat?.firstname} ${chat.lastname}`} src={chat.image} />
                      </ListItemAvatar>
                      <ListItemText primary={`${chat?.firstname} ${chat.lastname}`} />
                      <span>{`${getNotificationCount(chat.chatNotifications)}`}</span>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={8} style={styles.chatInbox}>
              {selectedChat !== null ? (
              // Render chat messages for the selected chat here
              // You can use another component to display the chat messages
              
                <ChatInbox
                  newMessage={props.newMessage}
                  receiver = {receiver}
                />
              ) : (
                <div>
                  <h2>Select a chat to start messaging</h2>
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </Box>
    </Container>
  );
};

export default ChatComponent;
