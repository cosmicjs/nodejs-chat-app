import React from 'react';
import { Redirect } from 'react-router-dom';

class Chat extends React.Component {
  render() {
    if (!Object.keys(this.props.user).length) {
      <Redirect to='/' />
    }

    return (
      <div className="chat-container">
        Chat Container
      </div>
    )
  }
}

export default Chat