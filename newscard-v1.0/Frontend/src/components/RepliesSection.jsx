import { Box, Card, Stack, Typography, Avatar, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import ScoreChanger from './ScoreChanger';
import CommentContext from '../commentContext';
import replyArrow from '../images/icon-reply.svg';
import AddReply from './AddReply';
import OwnReply from './OwnReply';

const RepliesSection = ({ onReplies, onClicked, onTar }) => {
  const { IMGOBJ } = useContext(CommentContext);
  const [repliess, setReplies] = useState(onReplies);

  const addReply = (data) => {
    setReplies([
      ...repliess,
      {
        id: Math.floor(Math.random() * 10000),
        content: data,
        createdAt: 'Just now',
        score: 0,
        replyingTo: `${onTar}`,
        replies: [],
        user: { username: 'juliusomo' },
      },
    ]);
  };
  const deleteReply = (id) => {
    setReplies(repliess.filter((reply) => reply.id !== id));
  };
  return (
    <Stack spacing={2} paddingLeft={10}>
      {repliess.map((rep) => {
        const { content, createdAt, score, user, replyingTo } = rep;
        const userName = user.username;
        const ava = IMGOBJ[`${userName}`];
        return userName === 'juliusomo' ? (
          <OwnReply
            key={rep.id}
            comId={rep.id}
            onContent={content}
            onTime={createdAt}
            onCount={score}
            onTar={replyingTo}
            onDel={deleteReply}
          />
        ) : (
          <Box sx={{ p: '0 15px' }}>
            <Stack spacing={2} direction="row">
              <Box>
                <ScoreChanger onScore={score} />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Stack
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar src={ava}></Avatar>
                    <Typography
                      fontWeight="bold"
                      sx={{ color: 'neutral.darkBlue' }}
                      fontSize="1rem"
                    >
                      {userName}
                    </Typography>
                    <Typography
                      sx={{ color: 'neutral.grayishBlue' }}
                      fontSize="1rem"
                    >
                      {createdAt}
                    </Typography>
                  </Stack>
                  <Button
                    variant="text"
                    sx={{
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      color: 'custom.moderateBlue',
                    }}
                    startIcon={<img src={replyArrow} alt="reply sign" />}
                  >
                    Reply
                  </Button>
                </Stack>
                <Typography
                  component="div"
                  sx={{ color: 'neutral.grayishBlue', p: '20px 0' }}
                  fontSize="1rem"
                >
                  <Typography
                    sx={{
                      color: 'custom.moderateBlue',
                      width: 'fit-content',
                      display: 'inline-block',
                      fontWeight: 500,
                    }}
                  >
                    {`@${replyingTo}`}
                  </Typography>{' '}
                  {content}
                </Typography>
              </Box>
            </Stack>
          </Box>
        );
      })}
      {onClicked ? <AddReply onAdd={addReply} /> : null}
    </Stack>
  );
};

export default RepliesSection;
