import React, { createContext, useEffect, useState } from 'react';
import data from './data.json';
import amyrobson from './images/avatars/image-amyrobson.png';
import maxblagun from './images/avatars/image-maxblagun.png';
import ramsesmiron from './images/avatars/image-ramsesmiron.png';
import juliusomo from './images/avatars/image-juliusomo.png';

const CommentContext = createContext();
const IMGOBJ = { amyrobson, maxblagun, ramsesmiron, juliusomo };
const { comments, currentUser } = data;

export function CommentProvider({ children }) {
  const [commentSection, setCommentSection] = useState([]);
  const addComment = (data) => {
    if (Array.isArray(data)) {
      if (data?.length == 0) {
        setCommentSection([]);
      } else {
        setCommentSection((prev) => [...prev, ...data]);
      }
    } else {
      setCommentSection((prev) => [
        ...prev,
        {
          id: Math.floor(Math.random() * 10000),
          content: data,
          createdAt: 'Just now',
          score: 0,
          replies: [],
          user: { username: 'juliusomo' },
        },
      ]);
    }
  };

  const deleteComment = (commentId) => {
    setCommentSection(
      commentSection.filter((comment) => comment.id !== commentId)
    );
  };

  const addReply = (replyContent) => {};

  const deleteReply = (id) => {};

  return (
    <CommentContext.Provider
      value={{
        currentUser,
        commentSection,
        IMGOBJ,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export default CommentContext;
