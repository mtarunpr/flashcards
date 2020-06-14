import React from 'react';
import './CardEditor.css';

class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { front: '', back: '' };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  addCard = () => {
    if (this.state.front.trim() === '' || this.state.back.trim() === '') {
      return;
    }
    this.props.addCard(this.state);
    this.setState({ front: '', back: ''});
  }

  deleteCard = index => this.props.deleteCard(index);

  render() {
    const cards = this.props.cards.map((card, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{card.front}</td>
          <td>{card.back}</td>
          <td><button onClick={() => this.deleteCard(index)}>Delete card</button></td>
        </tr>
      );
    });

    return (
      <div>
        <h2>Card Editor</h2>
        <input name="front" placeholder="Front of card" value={this.state.front} onChange={this.handleChange} />
        <input name="back" placeholder="Back of card" value={this.state.back} onChange={this.handleChange} />
        <button onClick={this.addCard}>Add card</button>
        <br />
        <br />
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Front</th>
              <th>Back</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cards}
          </tbody>
        </table>
        <hr />
        <button onClick={this.props.switchMode}>Go to Card Viewer</button>
      </div>
    );
  }
}

export default CardEditor;