import React from 'react';
import CardEditor from './CardEditor';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        { front: '1+1', back: '2' },
        { front: '2+2', back: '4' },
      ],
    };
  }

  render() {
    return <CardEditor cards={this.state.cards} />;
  }
}

export default App;
