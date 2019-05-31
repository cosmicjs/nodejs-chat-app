import React from 'react';
import { Redirect } from 'react-router-dom';

class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [],
    }
  }

  render() {
    if (!Object.keys(this.props.user).length) {
      return <Redirect to='/' />
    }

    return (
      <div className="chat-container">
        Chat Container
      </div>
    )
  }
}

export default Chat