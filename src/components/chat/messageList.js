import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

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

  static getDerivedStateFromProps(props, state) {
    const tempState = state;
    if (props.data.objectsByType) {
      tempState.messages = props.data.objectsByType;
    }

    return tempState;
  }

  render() {
    // const styles = {

    // }

    return (
      <div className="messageList-container">
        {this.state.messages.map(message => {
          return (
            <div
              key={message._id}
              dangerouslySetInnerHTML={{ __html: message.content }}
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
