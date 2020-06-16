import React from 'react';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import './CardEditor.css';

const DragHandle = sortableHandle(() => <span className='drag-handle'>::</span>);

const SortableItem = sortableElement(({ card }) => card);

const SortableContainer = sortableContainer(({ cards }) => <ul>{cards}</ul>);


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
    this.setState({ front: '', back: ''});
  }

  deleteCard = index => {
    this.props.deleteCard(index);
  }
  
  render() {
    const cards = this.props.cards.map((card, index) => {
      const cardli = (
        <div className='card-edit'>
          {index + 1}.&nbsp;
          <input name={'front' + index} placeholder='Front of card' value={card.front} onChange={this.handleChangeEdit} />
          <input name={'back' + index} placeholder='Back of card' value={card.back} onChange={this.handleChangeEdit} />
          <button onClick={() => this.deleteCard(index)}>Delete card</button>
          &nbsp;
          <DragHandle />
        </div>
      );
      return (
        <SortableItem key={index} index={index} card={cardli} />
      );
    });

    return (
      <div>
        <h2>Card Editor</h2>
        <input autoComplete='off' name='front' placeholder='Front of card' value={this.state.front} onChange={this.handleChangeAdd} />
        <input autoComplete='off' name='back' placeholder='Back of card' value={this.state.back} onChange={this.handleChangeAdd} />
        <button onClick={this.addCard}>Add card</button>
        <br />
        <br />

        <SortableContainer cards={cards} onSortEnd={this.props.onSortEnd} useDragHandle />

        {this.props.error &&
          <div className='error'>
            Error: Both sides of cards must be non-empty.
          </div>
        }

        <hr />
        <button disabled={this.props.error} onClick={this.props.switchMode}>Go to Card Viewer</button>
      </div>
    );
  }
}

export default CardEditor;