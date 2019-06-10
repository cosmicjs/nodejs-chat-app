import React from 'react';
import { Redirect } from 'react-router-dom';
import { socket } from '../../lib/socket.js';
import axios from 'axios';
import { IoIosChatboxes } from "react-icons/io";
import MessageList from './messageList.js';
import UserList from './userList.js';

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      users: [],
      content: '',
    }
    this.handleInput = this.handleInput.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
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
        alignItems: 'flex-end',
      },
      inputContainer: {
        width: 'calc(100% - 10px)',
        height: 'calc(150px - 40px)',
        borderTop: 'thin solid #d3d3d3',
        padding: '5px 20px',
        display: 'flex',
        flexDirections: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      input: {
        width: 'calc(100% - 375px)',
        height: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '110%',
        resize: 'none',
      },
      messageBtn: {
        height: '100%',
        width: '75px',
        fontSize: '200%',

      }
    }

    return (
      <div className="chat-container" style={styles.container}>
        <UserList user={this.props.user} />
        <MessageList user={this.props.user} />
        <form
          style={styles.inputContainer}
          onSubmit={this.handleMessage}
        >
          <textarea
            style={styles.input}
            name="content"
            value={this.state.content}
            onChange={this.handleInput}
            onKeyDown={this.onEnterPress}
            placeholder="Send a message ..."
          />
          <button style={styles.messageBtn} type="submit">
            <IoIosChatboxes />
          </button>
        </form>
      </div>
    );
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onEnterPress(e) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      this.handleMessage(e);
    }
  }

  handleMessage(e) {
    e.preventDefault();
    if (this.state.content) {
      axios.post(`${__API_URL__}/message`, {
        content: this.state.content,
        withCredentials: 'true',
      })
        .then(res => {
          this.setState({ content: '' });
          socket.emit('message', res.data);
        })
        .catch(err => this.setState({ requestError: err.response.data }));
    }
  }
}

export default Chat;
