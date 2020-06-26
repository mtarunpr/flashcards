import React from 'react';
import CardEditor from './CardEditor';
import CardViewer from './CardViewer';
import './App.css';
import arrayMove from 'array-move';
import { Switch, Route } from 'react-router-dom';
import Homepage from './Homepage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        { front: '1+1', back: '2' },
        { front: '5*2', back: '10' },
      ],
      error: false,
    };
  }

  addCard = card => {
    const cards = this.state.cards.slice().concat(card);
    this.setState({ cards });
  }

  deleteCard = index => {
    const cards = this.state.cards.slice();
    cards.splice(index, 1);
    this.setState({ cards }, this.validate);
  }

  editCard = (index, field, value) => {
    const cards = this.state.cards.slice();
    cards[index][field] = value;
    this.setState({ cards }, this.validate);
  }

  validate = () => {
    for (const card of this.state.cards) {
      if (CardEditor.isInvalid(card)) {
        this.setState({ error: true });
        return;
      }
    }
    this.setState({ error: false });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ cards }) => ({
      cards: arrayMove(cards, oldIndex, newIndex),
    }));
  };

  render() {
    return (
      <Switch>
        <Route exact path='/'>
          <Homepage />
        </Route>
        <Route exact path='/editor'>
          <CardEditor
            addCard={this.addCard}
            deleteCard={this.deleteCard}
            editCard={this.editCard}
            cards={this.state.cards}
            error={this.state.error}
            onSortEnd={this.onSortEnd}
          />
        </Route>
        <Route exact path='/viewer/:deckId'>
          <CardViewer />
        </Route>
      </Switch>
    );
  }
}

export default App;
