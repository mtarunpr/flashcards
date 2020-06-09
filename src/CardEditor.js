import React from 'react';

class CardEditor extends React.Component {
  render() {
    const cards = this.props.cards.map((card, index) => {
      return (
        <tr key={index}>
          <td>{card.front}</td>
          <td>{card.back}</td>
          <td><button>Delete</button></td>
        </tr>
      )
    });

    return (
      <div>
        <h2>Card Editor</h2>

        <table>
          <thead>
            <tr>
              <th>Front</th>
              <th>Back</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cards}
          </tbody>
        </table>
      </div>
    )
  }
}

export default CardEditor;