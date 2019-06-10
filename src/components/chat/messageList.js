import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Socket from '../../lib/socket.js';
import { IoIosPulse, IoIosText } from 'react-icons/io';

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
      container: {
        width: '90%',
        maxWidth: '900px',
        maxHeight: 'calc(100% - 160px)',
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      },
      loading: {
        height: '200px',
        width: '200px',
        position: 'fixed',
        left: '50%',
        top: '50%',
        marginLeft: '-100px',
        marginTop: '-100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      message: {
        width: 'auto',
        margin: '5px 0',
        padding: '10px',
        backgroundColor: '#20F2FA',
        color: '#383838',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        borderRadius: '5px',
      },
      isUser: {
        textAlign: 'right',
        backgroundColor: '#1FF0BD',
      },
    }

    if (this.props.data.loading) {
      return (
        <div className="loading-container" style={styles.loading}>
          <IoIosPulse style={{ fontSize: '200%' }} />
          <p>Loading Messages</p>
        </div>
      )
    } else if (!this.state.messages.length) {
      return (
        <div className="messageList-container">
          <IoIosText />
          <h3>No Messages in this chat room.</h3>
        </div>

      )
    }

    return (
      <div className="messageList-container" style={styles.container}>
        {this.state.messages.map(message => {
          return (
            <div
              key={message._id}
              className="message-container"
              dangerouslySetInnerHTML={{ __html: message.content }}
              style={this.props.user._id === message.user_id ? Object.assign(styles.message, styles.isUser) : styles.message}
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
