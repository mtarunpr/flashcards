import React from 'react';
import './CardEditor.css';
import arrayMove from 'array-move';

import { Link, withRouter } from 'react-router-dom';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';

const DragHandle = sortableHandle(() => (
  <span className='drag-handle material-icons'>
    drag_handle
  </span>
));

const SortableItem = sortableElement(({ card }) => card);

const SortableContainer = sortableContainer(({ cards }) => <ul>{cards}</ul>);

function Editable(props) {
  const i = props.index;

  return (
    <div className='card-edit'>
      <DragHandle />
      &nbsp;
      {i + 1}.&nbsp;
      <input
        autoComplete='off'
        name={'front' + i}
        placeholder='Front of card'
        value={props.card.front}
        onChange={props.handleChangeEdit}
      />
      <input
        autoComplete='off'
        name={'back' + i}
        placeholder='Back of card'
        value={props.card.back}
        onChange={props.handleChangeEdit}
      />
      <span className='material-icons delete-btn' onClick={() => props.deleteCard(i)}>delete</span>
    </div>
  );
}

class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        { front: 'front1', back: 'back1' },
        { front: 'front2', back: 'back2' },
      ],
      front: '',
      back: '',
      name: '',
    };
  }

  static isInvalid = card => {
    return !card.front.trim() || !card.back.trim();
  }

  validate = () => {
    if (!this.state.name.trim() || this.state.cards.length === 0) {
      return false;
    }
    for (const card of this.state.cards) {
      if (CardEditor.isInvalid(card)) {
        return false;
      }
    }
    return true;
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeEdit = event => {
    const inputName = event.target.name;
    const index = parseInt(inputName.substr(-1));
    const field = inputName.substring(0, inputName.length - 1);
    this.editCard(index, field, event.target.value);
  }

  addCard = () => {
    if (CardEditor.isInvalid(this.state)) {
      return;
    }
    const card = { front: this.state.front, back: this.state.back };
    const cards = this.state.cards.slice().concat(card);
    this.setState({ cards, front: '', back: '' });
  }

  editCard = (index, field, value) => {
    const cards = this.state.cards.slice();
    cards[index][field] = value;
    this.setState({ cards });
  }

  deleteCard = index => {
    const cards = this.state.cards.slice();
    cards.splice(index, 1);
    this.setState({ cards });
  }

  createDeck = () => {
    const deckId = this.props.firebase.push('/flashcards').key;
    const deck = { cards: this.state.cards, name: this.state.name };

    const updates = {};
    updates[`/flashcards/${deckId}`] = deck;
    updates[`/homepage/${deckId}/name`] = this.state.name;

    const onComplete = () => this.props.history.push(`/viewer/${deckId}`);

    this.props.firebase.update('/', updates, onComplete);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ cards }) => ({
      cards: arrayMove(cards, oldIndex, newIndex),
    }));
  };

  render() {
    const cards = this.state.cards.map((card, index) => {
      const cardli = (
        <Editable
          index={index}
          card={card}
          handleChangeEdit={this.handleChangeEdit}
          deleteCard={this.deleteCard}
        />
      );
      return (
        <SortableItem key={index} index={index} card={cardli} />
      );
    });

    return (
      <div>
        <h1>
          <Link to='/'>Flashcards</Link>
        </h1>
        <h2>Card Editor</h2>
        <div>
          <input
            autoComplete='off'
            name='name'
            className='deck-name'
            placeholder='Name of deck'
            value={this.state.name}
            onChange={this.handleChange}
          />
          <br />
          <br />
        </div>
        <div className='add-group'>
          <input
            autoComplete='off'
            name='front'
            placeholder='Front of card'
            value={this.state.front}
            onChange={this.handleChange}
          />
          <input
            autoComplete='off'
            name='back'
            placeholder='Back of card'
            value={this.state.back}
            onChange={this.handleChange}
          />
          <span className='material-icons add-btn' onClick={this.addCard}>add_circle_outline</span>
        </div>
        <br />

        <SortableContainer cards={cards} onSortEnd={this.onSortEnd} useDragHandle />

        <br />
        <button
          disabled={!this.validate()}
          onClick={this.createDeck}
        >
          Create Deck
        </button>
        <hr />
        <Link className='link-btn' to='/'>Home</Link>
      </div>
    );
  }
}

export default compose(withRouter, firebaseConnect())(CardEditor);