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

import logo from '../public/logo.svg';
import './_app.scss';

const client = new ApolloClient({
  uri: "https://graphql.cosmicjs.com/v1"
});

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      user: {},
      mobileMenuActive: false,
    }
    this.handleUser = this.handleUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogoPress = this.handleLogoPress.bind(this);
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
    const styles = {
      container: {
        height: '100%',
      },
      header: {
        maxHeight: '60px',
        padding: '0 30px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#29ABE2',
        color: '#ffffff',
        boxShadow: ' 0 4px 2px -2px gray',
      },
      logo: {
        width: '50px',
        marginRight: '30px',
        cursor: 'pointer',
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
          {this.state.user.name
            ? <header style={styles.header}>
              <img style={styles.logo} src={logo} onClick={this.handleLogoPress} />
              <div>
                <h3>{this.state.user.name} <span style={styles.appBttn} onClick={this.handleLogout}><FiLogOut /></span></h3>
              </div>
            </header>
            : null
          }
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
                    mobileMenuActive={this.state.mobileMenuActive}
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
    axios.post(`${__API_URL__}/logout`, { username: this.state.user.name.replace(/\s+/g, '-').toLowerCase() })
      .then(() => this.setState({ user: {} }, () => socket.emit('logout', {})))
      .catch(err => console.error(err));
  }

  handleLogoPress() {
    if (window.innerWidth < 700) {
      this.setState({ mobileMenuActive: !this.state.mobileMenuActive });
    }
  }
}

ReactDOM.hydrate(
  <App />,
  document.getElementById('app')
);

module.hot.accept();
