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

function sortArrayByDate(arr) {
  return arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

class MessageList extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    Socket.subscribeToMessages(this.props.data.refetch);
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.data.loading
      || prevProps.data.objectsByType.length !== this.props.data.objectByType.length
    ) {
      this.scrollToBottom();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const tempState = state;
    if (props.data.objectsByType) {
      tempState.messages = sortArrayByDate(props.data.objectsByType);
    }

    return tempState;
  }

  render() {
    const styles = {
      container: {
        position: 'relative',
        width: 'calc(100% - 255px)',
        maxHeight: 'calc(100% - 147px)',
        marginLeft: '10px',
        marginBottom: '25px',
        paddingRight: '10px',
        overflowY: 'auto',
        transition: '0.3s ease-in-out',
      },
      messagesTop: {
        width: '80%',
        margin: '10px auto 20px auto',
        paddingBottom: '10px',
        textAlign: 'center',
        borderBottom: 'thin solid #a9a9a9',
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
      messageWrapper: {
        height: '50px',
        marginBottom: '15px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      messageInfo: {
        width: '75px',
        minWidth: '75px',
      },
      message: {
        width: 'auto',
        maxWidth: '500px',
        zIndex: '99',
        padding: '10px',
        backgroundColor: '#20F2FA',
        color: '#383838',
        textShadow: '0.5px 0px 0px #ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        borderRadius: '5px',
      },
      arrow: {
        position: 'relative',
        width: '0',
        height: '0',
        zIndex: '100',
        borderTop: '10px solid transparent',
        borderBottom: '10px solid transparent',
        borderRight: '10px solid #20F2FA',
      },
      listGradient: {
        position: 'fixed',
        zIndex: '101',
        bottom: '140px',
        width: '100%',
        height: '75px',
        background: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
      },
      isUserWrapper: {
        justifyContent: 'flex-end',
      },
      isUserArrow: {
        borderRight: 'none',
        borderLeft: '10px solid #47C8FF',
      },
      isUserMessage: {
        textAlign: 'right',
        backgroundColor: '#47C8FF',
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

    function formatDate(datestring) {
      const date = new Date(datestring);
      const month = date.getMonth();
      const dateNum = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      return `${month} ${dateNum}, ${hours}:${minutes}`;
    }

    return (
      <div className="messageList-container" style={styles.container}>
        <div style={styles.messagesTop}>End of Messages</div>
        {this.state.messages.map(message => {
          return (
            <div
              key={message._id}
              style={this.props.user._id === message.metadata.user_id
                ? Object.assign({}, styles.messageWrapper, styles.isUserWrapper)
                : styles.messageWrapper}
            >
              {this.props.user._id !== message.metadata.user_id
                ? <div className="message-info" style={styles.messageInfo}>
                  <p>{message.title}</p>
                  <p>{formatDate(message.created_at)}</p>
                </div>
                : null
              }
              {this.props.user._id !== message.metadata.user_id
                ? <div style={styles.arrow}></div>
                : null
              }
              <span
                className="message-container"
                dangerouslySetInnerHTML={{ __html: message.content }}
                style={this.props.user._id === message.metadata.user_id
                  ? Object.assign({}, styles.message, styles.isUserMessage)
                  : styles.message}
              />
              {this.props.user._id === message.metadata.user_id
                ? <div style={Object.assign({}, styles.arrow, styles.isUserArrow)}></div>
                : null
              }
              {this.props.user._id === message.metadata.user_id
                ? <div className="message-info" style={styles.messageInfo}>
                  <p>You</p>
                  <p>{formatDate(message.created_at)}</p>
                </div>
                : null
              }
            </div>
          )
        })
        }
        <div id="bottomRef" style={{ height: '35px' }} />
        <div style={styles.listGradient} />
      </div >
    )
  }

  scrollToBottom() {
    const bottomRef = document.getElementById('bottomRef');
    if (bottomRef) {
      bottomRef.scrollIntoView({ behavior: 'smooth' });
    }
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
