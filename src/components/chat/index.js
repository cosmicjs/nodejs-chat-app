import React from 'react';
import { Redirect } from 'react-router-dom';
import MessageList from './messageList.js';
import UserList from './userList.js';

class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      users: [],
    }
  }

  render() {
    if (!Object.keys(this.props.user).length) {
      return <Redirect to='/' />
    }

    return (
      <div className="chat-container">
        <MessageList />
        <UserList />
      </div>
    )
  }
}

export default Chat;
