import React from 'react';
import { FlexboxGrid, Panel, Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar } from 'rsuite';

class LoginForm extends React.Component {
  render() {
    return (
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={12}>
          <Panel header={<h3>Login</h3>} bordered>
            <Form fluid>
              <FormGroup>
                <ControlLabel>Enter a Username</ControlLabel>
                <FormControl name="name" />
              </FormGroup>
              <FormGroup>
                <ButtonToolbar>
                  <Button appearance="primary">Start Chatting</Button>
                </ButtonToolbar>
              </FormGroup>
            </Form>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    )
  }
}

export default LoginForm