import React from 'react';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import './CardEditor.css';
import { Link } from 'react-router-dom';

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
    this.state = { front: '', back: '' };
  }

  static isInvalid = card => {
    return card.front.trim() === '' || card.back.trim() === '';
  }

  handleChangeAdd = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeEdit = event => {
    const inputName = event.target.name;
    const index = parseInt(inputName.substr(-1));
    const field = inputName.substring(0, inputName.length - 1);
    this.props.editCard(index, field, event.target.value);
  }

  addCard = () => {
    if (CardEditor.isInvalid(this.state)) {
      return;
    }
    this.props.addCard(this.state);
    this.setState({ front: '', back: '' });
  }

  deleteCard = index => {
    this.props.deleteCard(index);
  }

  render() {
    const cards = this.props.cards.map((card, index) => {
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
        <h1><Link className={this.props.error ? 'disabled' : ''} to='/'>Flashcards</Link></h1>
        <h2>Card Editor</h2>
        <div className='add-group'>
          <input autoComplete='off' name='front' placeholder='Front of card' value={this.state.front} onChange={this.handleChangeAdd} />
          <input autoComplete='off' name='back' placeholder='Back of card' value={this.state.back} onChange={this.handleChangeAdd} />
          <span className='material-icons add-btn' onClick={this.addCard}>add_circle_outline</span>
        </div>
        <br />

        <SortableContainer cards={cards} onSortEnd={this.props.onSortEnd} useDragHandle />

        {this.props.error &&
          <div className='error'>
            Error: Both sides of cards must be non-empty.
          </div>
        }

        <hr />
        <Link className={(this.props.error ? 'disabled' : '') + ' link-btn'} to='/viewer'>Go to Card Viewer</Link>
      </div>
    );
  }
}

export default CardEditor;