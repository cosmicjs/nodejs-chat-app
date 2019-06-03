import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import axios from 'axios';
import { socket } from './lib/socket.js';
import LoginForm from './components/loginForm/loginForm.js';
import Chat from './components/chat/index.js';

import './_app.scss';

const client = new ApolloClient({
  uri: "https://graphql.cosmicjs.com/v1"
});

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      user: {},
    }
    this.handleUser = this.handleUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem('cosmic-messenger-user')) {
      this.setState({ user: JSON.parse(localStorage.getItem('cosmic-messenger-user')) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.user.name && this.state.user !== prevState.user) {
      localStorage.setItem('cosmic-messenger-user', JSON.stringify(this.state.user));
    }
    if (!this.state.user.name && this.state.user !== prevState.user) {
      localStorage.removeItem('cosmic-messenger-user');
    }
  }

  render() {
    console.log(this.state)
    const styles = {
      container: {
        height: '100%',
      },
      header: {
        maxHeight: '60px',
        padding: '0 15px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#29ABE2',
        color: '#ffffff',
        boxShadow: ' 0 4px 2px -2px gray',
      },
      content: {
        height: 'calc(100% - 60px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      appBttn: {
        margin: '15px',
        borderRadius: '20px',
        cursor: 'pointer',
      }
    }

    return (
      <ApolloProvider client={client}>
        <div className="app-container" style={styles.container}>
          <header style={styles.header}>
            <div>
              {this.state.user.name
                ? <h3>{this.state.user.name} <span style={styles.appBttn} onClick={this.handleLogout}><FiLogOut /></span></h3>
                : null
              }
            </div>
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
      </ApolloProvider>
    );
  }

  handleUser(user) {
    this.setState({ user })
  }

  handleLogout() {
    axios.post(`${__API_URL__}/logout`, { userName: this.state.user.name.replace(/\s+/g, '-').toLowerCase() })
      .then(() => this.setState({ user: {} }))
      .catch(err => console.error(err));
  }
}

ReactDOM.hydrate(
  <App />,
  document.getElementById('app')
);

module.hot.accept();
