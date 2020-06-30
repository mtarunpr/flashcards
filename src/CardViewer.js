import React from 'react';
import './CardViewer.css';

import { Link, withRouter } from 'react-router-dom';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';

class CardViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: 0,
      showFront: true,
      shuffle: false,
      cards: [],
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }
  
  componentDidUpdate = prevProps => {
    if (this.props.cards && this.props.cards !== prevProps.cards) {
      const idx = Math.min(this.state.idx, this.props.cards.length - 1);
      this.setState({ idx: idx, cards: this.props.cards });
    }
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
    else if (event.keyCode === 32) {
      this.flipCard();
    }
  }

  render() {
    if (!isLoaded(this.props.cards)) {
      return <div>Loading...</div>;
    }

    if (isEmpty(this.props.cards)) {
      return <div>Error: Deck not found.</div>;
    }

    const card = this.state.cards[this.state.idx];
    const idx = this.state.idx;
    const ncards = this.state.cards.length;

    return (
      <div>
        <h1><Link to='/'>Flashcards</Link></h1>
        <h2>{this.props.name}</h2>

        {ncards > 0 &&
          <div className='viewer'>
            <div className='card' onClick={this.flipCard}>
              {this.state.showFront ? card.front : card.back}
            </div>
            <button disabled={idx === 0} className='material-icons seeker' onClick={() => this.seek(-1)}>arrow_back</button>
            Progress: {idx + 1}/{ncards}
            <button disabled={idx + 1 === ncards} className='material-icons seeker' onClick={() => this.seek(1)}>arrow_forward</button>
            <br />
            <button onClick={this.toggleShuffle}>{this.state.shuffle ? 'Unshuffle!' : 'Shuffle!'}</button>
          </div>
        }

        <hr />
        <Link className='link-btn' to='/'>Home</Link>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const deck = state.firebase.data[props.match.params.deckId];
  const name = deck && deck.name;
  const cards = deck && deck.cards;
  return { name, cards };
}

export default compose(
  withRouter,
  firebaseConnect(props => {
    const deckId = props.match.params.deckId;
    return [{ path: `/flashcards/${deckId}`, storeAs: deckId }];
  }),
  connect(mapStateToProps),
)(CardViewer);