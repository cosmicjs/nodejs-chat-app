import React from 'react';
import { Redirect } from 'react-router-dom';
import MessageList from './messageList.js';
import UserList from './userList.js';

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      users: [],
      text: '',
    }
    this.handleInput = this.handleInput.bind(this);
  }

  render() {
    if (!Object.keys(this.props.user).length) {
      return <Redirect to='/' />
    }

    const styles = {
      container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      inputContainer: {
        width: '100%',
        height: '50px',
      }
    }

    return (
      <div className="chat-container" style={styles.container}>
        <MessageList user={this.props.user} />
        <UserList user={this.props.user} />
        <div style={styles.inputContainer}>
          <input
            value={this.state.text}
            onChange={this.handleInput}
          />
        </div>
      </div>
    );
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
}

export default Chat;
