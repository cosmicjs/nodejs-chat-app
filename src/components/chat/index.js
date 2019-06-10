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
        alignItems: 'center',
      },
      inputContainer: {
        width: '100%',
        height: '100px',
        borderTop: 'thin solid #a9a9a9',
        paddingTop: '5px',
        display: 'flex',
        flexDirections: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      input: {
        width: 'calc(100% - 100px)',
        maxWidth: '800px',
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
          ref={(el) => this.formRef = el}
          style={styles.inputContainer}
          onSubmit={this.handleMessage}
        >
          <textarea
            style={styles.input}
            name="content"
            value={this.state.content}
            onChange={this.handleInput}
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

  handleMessage(e) {
    e.preventDefault()
    if (this.state.content) {
      axios.post(`${__API_URL__}/message`, {
        content: this.state.content,
        withCredentials: 'true',
      })
        .then(res => {
          socket.emit('message', res.data);
          this.formRef.reset();
        })
        .catch(err => this.setState({ requestError: err.response.data }));
    }
  }
}

export default Chat;
