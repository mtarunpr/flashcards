import React from 'react';
import './CardViewer.css';

class CardViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 0,
      showFront: true,
    };
  }

  flipCard = () => {
    this.setState({ showFront: !this.state.showFront });
  }

  seek = delta => {
    if (!this.state.showFront) {
      this.flipCard();
    }
    this.setState({ idx: this.state.idx + delta });
  }

  render() {
    const card = this.props.cards[this.state.idx];
    const idx = this.state.idx;
    const ncards = this.props.cards.length;

    return (
      <div>
        <h2>Card Viewer</h2>

        {ncards > 0 &&
          <div>
            <div className='viewer' onClick={this.flipCard}>
              {this.state.showFront ? card.front : card.back}
            </div>
            <button disabled={idx === 0} className='seeker' onClick={() => this.seek(-1)}>Prev</button>
            Progress: {idx + 1}/{ncards}
            <button disabled={idx + 1 === ncards} className='seeker' onClick={() => this.seek(1)}>Next</button>
          </div>
        }

        <hr />
        <button onClick={this.props.switchMode}>Go to Card Editor</button>
      </div>
    );
  }
}

export default CardViewer;