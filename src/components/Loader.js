import React from 'react';
import Loader from 'react-loader-spinner';
export default class App extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Loader
          type="Circles"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={0}
        />
      </div>
    );
  }
}
