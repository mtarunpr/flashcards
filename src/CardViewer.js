import React from 'react';
import './CardViewer.css';

class CardViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 0,
      showFront: true,
      shuffle: false,
      cards: this.props.cards,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  flipCard = () => {
    this.setState({ showFront: !this.state.showFront });
  }

  seek = delta => {
    this.setState({
      idx: this.state.idx + delta,
      showFront: true,
    });
  }

  toggleShuffle = () => {
    const shuffle = !this.state.shuffle;
    if (shuffle) {
      const cards = this.state.cards.slice().sort(() => Math.random() - 0.5);
      this.setState({ cards });
    } else {
      this.setState({ cards: this.props.cards });
    }
    this.setState({
      idx: 0,
      showFront: true,
      shuffle,
    });
  }

  onKeyDown = event => {
    if (event.keyCode === 37 && this.state.idx > 0) {
      this.seek(-1);
    }
    else if (event.keyCode === 39 && this.state.idx + 1 < this.state.cards.length) {
      this.seek(1);
    }
  }

  render() {
    const card = this.state.cards[this.state.idx];
    const idx = this.state.idx;
    const ncards = this.state.cards.length;

    return (
      <div>
        <h2>Card Viewer</h2>

        {ncards > 0 &&
          <div className='viewer'>
            <div className='card' onClick={this.flipCard}>
              {this.state.showFront ? card.front : card.back}
            </div>
            <button disabled={idx === 0} className='seeker' onClick={() => this.seek(-1)}>Prev</button>
            Progress: {idx + 1}/{ncards}
            <button disabled={idx + 1 === ncards} className='seeker' onClick={() => this.seek(1)}>Next</button>
            <br />
            <button onClick={this.toggleShuffle}>{this.state.shuffle ? 'Unshuffle!' : 'Shuffle!'}</button>
          </div>
        }

        <hr />
        <button onClick={this.props.switchMode}>Go to Card Editor</button>
      </div>
    );
  }
}

export default CardViewer;