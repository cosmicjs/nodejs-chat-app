import React from 'react';
import { Redirect } from 'react-router-dom';
// import { FlexboxGrid, Panel, Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'rsuite';
import axios from 'axios';

class LoginForm extends React.Component {
  constructor() {
    super()
    this.state = {
      userName: '',
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      userInput: {
        height: '25px',
        padding: '5px',
        border: 'thin solid #29ABE2',
        borderRadius: '5px',
        outline: 'none',
      },
      button: {
        color: '#ffffff',
        outline: 'none',
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
              name="userName"
              placeholder="Username"
              style={styles.userInput}
              value={this.state.userName}
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
      userName: this.state.userName,
    })
      .then(res => {
        console.log(res.data)
        this.props.handleUser(res.data)
      })
      .catch(err => this.setState({ requestError: err.response.data }))
  }
}

export default LoginForm