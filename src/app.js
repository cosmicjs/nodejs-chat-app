import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container, Header, Navbar, Content } from 'rsuite';
import LoginForm from './components/loginForm/loginForm.js';
import Chat from './components/chat/chat.js';

import 'rsuite/dist/styles/rsuite.min.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      user: {},
    }
    this.handleUser = this.handleUser.bind(this)
  }

  render() {
    console.log(this.state)
    const styles = {
      navHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      },
    }

    return (
      <div className="app-container">
        <Container>
          <Header>
            <Navbar appearance='inverse' style={styles.navHeader}>
              <Navbar.Header>
                <h1 className="navbar-brand logo">Cosmic Messenger</h1>
              </Navbar.Header>
            </Navbar>
          </Header>
          <Content>
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
          </Content>
        </Container>
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
