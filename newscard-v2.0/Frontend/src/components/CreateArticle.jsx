import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// import { ReactComponent as SendIcon } from '../../assets/svg/send.svg';
import { Send } from '@mui/icons-material';

import '../styles/createArticle.css';
import { Box, Button, Typography } from '@mui/material';
import { useNotification } from '../hooks/useNotification';
import axios from '../utils/axios';

const CreateArticle = ({
  setMessage,
  sendMessage,
  message,
  setIsCreateArticleClicked,
  cardId,
}) => {
  const { displayNotification } = useNotification();
  const editorRef = useRef(null);

  const createArticle = async () => {
    const params = { cardId, body: message };
    try {
      const res = await axios.post('/card/create-article', params);
      if (res) {
        if (res.status === 200 && res.data.success === '0') {
          console.log(res.data.message);
          // alert(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        } else if (res.status === 201 && res.data.success === '1') {
          console.log(res.data.message);
          displayNotification({
            message: res?.data?.message,
            type: 'success',
          });
          setIsCreateArticleClicked(false);
        } else {
          displayNotification({
            message: res?.data?.message,
            type: 'error',
          });
        }
      } else {
        console.log('error');
      }
    } catch (err) {
      console.log(err);
      displayNotification({
        message: err,
        type: 'error',
      });
    }
  };
  return (
    <>
      <form className="createArticleForm">
        <Editor
          apiKey="xa94hhlyk5o0cx6lgd9yqrzvwkx9cgofl5ztlqyx6ldc70i5"
          value={message}
          onEditorChange={(newValue) => setMessage(newValue)}
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            max_height: 600,

            menubar: true,
            statusbar: false,
            autoresize_bottom_margin: 0,
            plugins: 'link lists emoticons image autoresize codesample',
            toolbar:
              'bold italic strikethrough link numlist bullist blockquote emoticons image codesample | sendBtn',
            codesample_languages: [
              { text: 'HTML/XML', value: 'markup' },
              { text: 'JavaScript', value: 'javascript' },
              { text: 'CSS', value: 'css' },
              { text: 'PHP', value: 'php' },
              { text: 'Ruby', value: 'ruby' },
              { text: 'Python', value: 'python' },
              { text: 'Java', value: 'java' },
              { text: 'C', value: 'c' },
              { text: 'C#', value: 'csharp' },
              { text: 'C++', value: 'cpp' },
            ],
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
        <Box display="flex" justifyContent="center">
          <Button
            color="secondary"
            variant="contained"
            className="createArticleSendButton"
            onClick={(e) => {
              createArticle();
              sendMessage(e);
            }}
          >
            <Typography variant="body2">Submit</Typography>
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CreateArticle;
