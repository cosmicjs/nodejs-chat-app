import React from 'react';
import { Redirect } from 'react-router-dom';
import { socket } from '../../lib/socket.js';
import axios from 'axios';

class LoginForm extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      requestError: {},
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
  }

  render() {
    const styles = {
      container: {
        width: '200px',
        height: '200px',
        margin: '200px',
        borderRadius: '10px',
        border: 'thin solid #d3d3d3',
      },
      form: {
        height: '100%',
        fontSize: '130%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      userInput: {
        height: '25px',
        padding: '5px',
        fontSize: '70%',
        border: 'thin solid #29ABE2',
        borderRadius: '5px',
        outline: 'none',
      },
      button: {
        color: '#ffffff',
        outline: 'none',
        fontSize: '70%',
        cursor: 'pointer',
        borderRadius: '5px',
        backgroundColor: '#29ABE2',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        border: 'none',
      }
    }

    if (!Object.keys(this.props.user).length) {
      return (
        <div className="loginForm-container" style={styles.container}>

          <form style={styles.form}>
            {this.state.requestError.message
              ? <label>That Username is already in use</label>
              : <label>Enter a Username</label>
            }
            <input
              name="username"
              placeholder="Username"
              style={styles.userInput}
              value={this.state.username}
              onChange={this.handleInput}
              autoFocus
            />
            <button
              onClick={this.handleRegister}
              style={styles.button}
            >
              Start Chatting
            </button>
          </form>
        </div>
      )
    }

    return <Redirect to={`/${this.props.user.name.replace(/\s+/g, '-').toLowerCase()}`} />
  }

  handleInput(e) {
    if (this.state.requestError.message) {
      this.setState({ requestError: {} })
    }
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleRegister(e) {
    e.preventDefault()
    axios.post(`${__API_URL__}/register`, {
      username: this.state.username,
    })
      .then(res => {
        this.props.handleUser(res.data);
        socket.emit('register', res.data);
      })
      .catch(err => this.setState({ requestError: err.response.data }));
  }
}

export default LoginForm