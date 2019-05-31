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
  render() {
    console.log(this.props.data)
    return (
      <div className="messageList-container">
        {/* Message list spreads here */}
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
