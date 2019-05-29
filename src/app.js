import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div className="app-container">
        <h1>Cosmic Messenger</h1>
        <p>Render Test</p>
        <p>Something New</p>
      </div>
    )
  }
}

ReactDOM.hydrate(
  <App />,
  document.getElementById('app')
);

module.hot.accept();
