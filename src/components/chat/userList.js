import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const GET_USERS = gql`
  query UserList($read_key: String!) {
    objectsByType(bucket_slug: "cosmic-messenger", type_slug: "users", read_key: $read_key ) {
      _id
      title
      created_at
      metadata
    }
  }
`

class UserList extends React.Component {
  render() {
    console.log(this.props.data)
    return (
      <div className="userList-container">
        {/* List of users spreads here */}
      </div>
    )
  }
}

export default graphql(GET_USERS, {
  options: {
    variables: {
      read_key: __COSMIC_READ_KEY__,
    }
  },
  props: ({ data }) => ({
    data,
  })
})(UserList);