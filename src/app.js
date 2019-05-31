import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginForm from './components/loginForm/loginForm.js';
import Chat from './components/chat/chat.js';

import './_app.scss';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      user: {},
    }
    this.handleUser = this.handleUser.bind(this)
  }

  componentWillMount() {
    if (localStorage.getItem('cosmic-messenger-user')) {
      this.setState({ user: JSON.parse(localStorage.getItem('cosmic-messenger-user')) })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.user && this.state.user !== prevState.user) {
      localStorage.setItem('cosmic-messenger-user', JSON.stringify(this.state.user))
    }
  }

  render() {
    console.log(this.state)
    const styles = {
      header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#29ABE2',
        color: '#ffffff',
        boxShadow: ' 0 4px 2px -2px gray',
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }

    return (
      <div className="app-container">
        <header style={styles.header}>
          <h1>Cosmic Messenger</h1>
        </header>
        <div className="app-content" style={styles.content}>
          <BrowserRouter>
            <Route exact path='/'
              render={props => (
                <LoginForm
                  user={this.state.user}
                  handleUser={this.handleUser}
                  {...props}
                />
              )}
            />
            <Route path='/:user'
              render={props => (
                <Chat
                  user={this.state.user}
                  {...props}
                />
              )}
            />
          </BrowserRouter>
        </div>
      </div>
    )
  }

  handleUser(user) {
    this.setState({ user })
  }
}

ReactDOM.hydrate(
  <App />,
  document.getElementById('app')
);

module.hot.accept();
