import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// import { ReactComponent as SendIcon } from '../../assets/svg/send.svg';
import { Send } from '@mui/icons-material';

import '../styles/chatInput.css';

const ChatInput = ({ setMessage, sendMessage, message }) => {
  const editorRef = useRef(null);
  return (
    <form className="form">
      <Editor
        apiKey="xa94hhlyk5o0cx6lgd9yqrzvwkx9cgofl5ztlqyx6ldc70i5"
        value={message}
        onEditorChange={(newValue) => setMessage(newValue)}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 200,
          max_height: 200,
          width: '100%',
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
      <button className="sendButton" onClick={(e) => sendMessage(e)}>
        <Send className="sendIcon" />
      </button>
    </form>
  );
};

export default ChatInput;
