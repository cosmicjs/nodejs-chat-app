import React from 'react';
import { Redirect } from 'react-router-dom';
import { FlexboxGrid, Panel, Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'rsuite';
import axios from 'axios';

class LoginForm extends React.Component {
  constructor() {
    super()
    this.state = {
      userName: '',
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
  }

  render() {
    const styles = {
      container: {
        margin: '200px',
      }
    }

    if (!Object.keys(this.props.user).length) {
      return (
        <FlexboxGrid justify="center" className="loginForm-container" style={styles.container}>
          <FlexboxGrid.Item colspan={12}>
            <Panel header={<h3>Login</h3>} bordered>
              <Form fluid>
                <FormGroup>
                  <ControlLabel>Enter a Username</ControlLabel>
                  <FormControl name="userName" value={this.state.userName} onChange={this.handleInput} />
                </FormGroup>
                <FormGroup>
                  <ButtonToolbar>
                    <Button appearance="primary" onClick={this.handleRegister}>Start Chatting</Button>
                  </ButtonToolbar>
                </FormGroup>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )
    }

    return <Redirect to={`/${this.props.user.username.toLowerCase()}`} />
  }

  handleInput(value) {
    this.setState({ userName: value })
  }

  handleRegister() {
    axios.post(`${__API_URL__}/register`, {
      userName: this.state.userName,
    })
      .then(res => this.props.handleUser(res.data))
      .catch(err => console.error(err));
  }
}

export default LoginForm