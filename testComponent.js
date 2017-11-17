// import React, {PureComponent} from 'react';

// export default class TextyComponent extends React.PureComponent {
//   render() {
//     return (
//       <div>
//         <h1>Some awesome Text</h1>
//       </div>
//     )
//   }
// }

const React = require('react');

class TextyComponent extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Some awesome component, hello sonu</h1>
      </div>
    )
  }
}

module.exports = TextyComponent;
