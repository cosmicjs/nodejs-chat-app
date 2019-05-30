import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Header, Navbar, Content } from 'rsuite';
import LoginForm from './components/loginForm/loginForm.js'

import 'rsuite/dist/styles/rsuite.min.css';

class App extends React.Component {
  render() {
    const styles = {
      navHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }
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
            <LoginForm />
          </Content>
        </Container>

      </div>
    )
  }
}

ReactDOM.hydrate(
  <App />,
  document.getElementById('app')
);

module.hot.accept();
