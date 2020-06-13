import React from 'react';
import CardEditor from './CardEditor';
import CardViewer from './CardViewer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        { front: '1+1', back: '2' },
        { front: '5*2', back: '10'},
      ],
      editor: true,
    };
  }

  addCard = card => {
    const cards = this.state.cards.slice().concat(card);
    this.setState({ cards });
  }

  deleteCard = index => {
    const cards = this.state.cards.slice();
    cards.splice(index, 1);
    this.setState({ cards });
  }

  switchMode = () => this.setState({ editor: !this.state.editor });

  render() {
    if (this.state.editor) {
      return (
        <CardEditor 
          addCard={this.addCard}
          deleteCard={this.deleteCard}
          cards={this.state.cards}
          switchMode={this.switchMode}
        />
      );
    } else {
      return (
        <CardViewer
          cards={this.state.cards}
          switchMode={this.switchMode} />
      );
    }
  }
}

export default App;
