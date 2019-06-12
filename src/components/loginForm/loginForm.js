import React from 'react';
import { Redirect } from 'react-router-dom';
import { socket } from '../../lib/socket.js';
import axios from 'axios';

import Logo from '../../../public/logo.svg';

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
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      form: {
        position: 'relative',
        height: '200px',
        padding: '20px',
        fontSize: '130%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '10px',
        background: 'linear-gradient(rgba(115, 173, 255, 1), rgba(102, 246, 255, 1))',
        color: '#ffffff',
        alignItems: 'flex-start',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
        transition: '0.3s ease-in-out',
      },
      logo: {
        width: '150px',
        margin: '30px',
      },
      inputContainer: {
        margin: '15px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        transition: '0.3s ease-in-out',
      },
      label: {
        padding: '8px',
        fontSize: '70% !important',
        borderRadius: '5px',
        backgroundColor: '#00AFD7',
      },
      arrow: {
        position: 'relative',
        width: '0',
        height: '0',
        marginRight: '5px',
        zIndex: '100',
        borderTop: '10px solid transparent',
        borderBottom: '10px solid transparent',
        borderLeft: '10px solid #00AFD7',
      },
      userInput: {
        height: '25px',
        padding: '5px',
        fontSize: '70%',
        border: 'none',
        borderRadius: '5px',
        outline: 'none',
      },
      button: {
        width: '100px',
        padding: '10px',
        marginTop: '20px',
        marginBottom: '20px',
        marginLeft: 'calc(50% - 50px)',
        color: '#29ABE2',
        outline: 'none',
        fontSize: '70%',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        border: 'none',
        borderRadius: '30px',
      }
    }

    if (!Object.keys(this.props.user).length) {
      return (
        <div className="loginForm-container" style={styles.container}>
          <img src={Logo} style={styles.logo} />
          <form id="loginForm" style={styles.form}>
            <h5><strong>Hi!</strong> Welcome to Cosmic Messenger</h5>
            <p>Please give us a little bit of info.</p>
            <div style={styles.inputContainer}>
              {this.state.requestError.message
                ? <label style={styles.label}>That Username is already in use</label>
                : <label style={styles.label}>Enter a Username</label>
              }
              <div style={styles.arrow} />
              <input
                name="username"
                placeholder="Some name you like..."
                style={styles.userInput}
                value={this.state.username}
                onChange={this.handleInput}
                autoFocus
              />
            </div>
            <button
              onClick={this.handleRegister}
              style={styles.button}
            >
              Start Chatting
            </button>
          </form>
          <footer>
            <a href="https://cosmicjs.com/add-bucket?import_bucket=5cf1605916e7ec14adabbb89"><img src="https://cdn.cosmicjs.com/51fe54d0-4f6e-11e9-9f32-8d001da69630-powered-by-cosmicjs.svg" /></a>
          </footer>
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