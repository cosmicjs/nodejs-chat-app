import React from 'react';
import { Redirect } from 'react-router-dom';
import { socket } from '../../lib/socket.js';
import axios from 'axios';
import { IoIosSend } from "react-icons/io";
import MessageList from './messageList.js';
import UserList from './userList.js';

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      content: '',
      selectedUsers: [],
    }
    this.handleInput = this.handleInput.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleUserSelect = this.handleUserSelect.bind(this);
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
        height: '110px',
        padding: '5px 20px',
        display: 'flex',
        flexDirections: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
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
        height: '30px',
        width: '75px',
        border: 'none',
        borderRadius: '10px',
        outline: 'none',
        backgroundColor: '#ffffff',
        color: '#29ABE2',
        fontSize: '200%',
        cursor: 'pointer',
      }
    }

    return (
      <div className="chat-container" style={styles.container}>
        <UserList
          mobileMenuActive={this.props.mobileMenuActive}
          user={this.props.user}
          selectedUsers={this.state.selectedUsers}
        />
        <MessageList
          user={this.props.user}
          selectedUsers={this.state.selectedUsers}
        />
        <form
          id="message-input"
          style={styles.inputContainer}
          onSubmit={this.handleMessage}
        >
          <textarea
            className='input-area'
            style={styles.input}
            name="content"
            value={this.state.content}
            onChange={this.handleInput}
            onKeyDown={this.onEnterPress}
            placeholder="Send a message ..."
          />
          <button
            id="send-btn"
            style={styles.messageBtn}
            type="submit"
          >
            <IoIosSend />
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
      axios({
        method: 'post',
        url: `${__API_URL__}/message`,
        headers: {
          withCredentials: 'true',
        },
        data: {
          title: this.props.user.name,
          content: this.state.content,
        },
      })
        .then(res => {
          this.setState({ content: '' });
          socket.emit('message', res.data);
        })
        .catch(err => this.setState({ requestError: err.response.data }));
    }
  }

  handleUserSelect(user) {
    this.setState({
      selectedUsers: [...this.state.selectedUsers, user]
    });
  }
}

export default Chat;
