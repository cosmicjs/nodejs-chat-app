import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Socket from '../../lib/socket.js';

const GET_MESSAGES = gql`
  query MessageList($read_key: String!) {
    objectsByType(bucket_slug: "cosmic-messenger", type_slug: "messages", read_key: $read_key ) {
      _id
      title
      content
      created_at 
      metadata
    }
  }
`

class MessageList extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    Socket.subscribeToMessages(this.props.data.refetch);
  }

  static getDerivedStateFromProps(props, state) {
    const tempState = state;
    if (props.data.objectsByType) {
      tempState.messages = props.data.objectsByType;
    }

    return tempState;
  }

  render() {
    const styles = {
      message: {
        padding: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        borderRadius: '5px',
      }
    }

    return (
      <div className="messageList-container">
        {this.state.messages.map(message => {
          return (
            <div
              key={message._id}
              className="message-container"
              dangerouslySetInnerHTML={{ __html: message.content }}
              style={styles.message}
            />
          )
        })}
      </div>
    )
  }
}

export default graphql(GET_MESSAGES, {
  options: {
    variables: {
      read_key: __COSMIC_READ_KEY__,
    }
  },
  props: ({ data }) => ({
    data,
  })
})(MessageList);
