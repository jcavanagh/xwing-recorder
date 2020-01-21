import React, { useContext, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup';
import Media from 'react-bootstrap/Media';

import { AppContext } from '../app/state';
import { UserImage } from '../user';

function ChatWidget({ messageRecord: mr }) {
  if(!mr) { return null; }

  const timestamp = new Date(mr.timestamp);
  const displayDate = timestamp ? `${timestamp.getHours()}:${timestamp.getMinutes()}` : ''

  return (
    <Media style={{ border: '1px solid #CCC', borderRadius: '5px', background: '#EEE' }}>
      <UserImage displayName={mr.displayName} photoURL={mr.photoURL} width={48} height={48} />
      <Media.Body>
        <div>
          <span className='align-middle'>{mr.displayName}</span>&nbsp;
          <span className='align-middle' style={{ color: '#AAA' }}>{displayDate}</span>
        </div>
        <div>{mr.message}</div>
      </Media.Body>
    </Media>
  );
}

function ChatMessages({ messages }) {
  const msgEls = messages.map((m, idx) => {
    return (
      <ChatWidget key={idx} messageRecord={m} />
    );
  });

  return (
    <div style={{ display: 'flex', flex: 1, flexFlow: 'column', overflowY: 'auto' }}>
      {msgEls}
      <div></div>
    </div>
  );
}

function ChatInput() {
  const state = useContext(AppContext);
  const [chatInput, setChatInput] = useState('');

  const handleClick = () => {
    state.lobby.chat.send(chatInput);
    setChatInput('');
  };

  const handleKeyDown = (e) => {
    if(e.keyCode === 13) {
      handleClick();
    }
  }

  return (
    <InputGroup>
      <Form.Control placeholder='Message' value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={handleKeyDown} />
      <InputGroup.Append>
        <Button variant='primary' onClick={handleClick}>Send</Button>
      </InputGroup.Append>
    </InputGroup>
  )
}

export function Chat({ gameId }) {
  const state = useContext(AppContext);

  // Lobby chat is in the realtime DB
  // If we have no game ID, assume this is lobby chat
  let messages = [];
  if(gameId) {
    // TODO: Find game from state and get messages
  } else {
    // Lobby chat
    messages = state.lobby.chat.value;
  }

  return (
    <div style={{ display: 'flex', flexFlow: 'column', flex: 1 }}>
      <ChatMessages messages={messages} />
      <ChatInput />
    </div>
  )
}
