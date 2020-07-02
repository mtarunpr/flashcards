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
      showStarred: false,
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

  star = event => {
    const deckId = this.props.match.params.deckId;
    this.props.firebase.update(
      `/flashcards/${deckId}/cards/${this.state.idx}`,
      { starred: !this.state.cards[this.state.idx].starred },
    );
    event.stopPropagation();
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

  toggleShowStarred = () => {
    this.setState({ showStarred: !this.state.showStarred });
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
        <p>{this.props.description}</p>

        {ncards > 0 &&
          <div className='viewer'>
            <div className='card' onClick={this.flipCard}>
              <span className='material-icons star' onClick={this.star}>
                {this.state.cards[this.state.idx].starred ? 'star' : 'star_outline'}
              </span>
              <div className='card-content'>
                {this.state.showFront ? card.front : card.back}
              </div>
            </div>
            <button disabled={idx === 0} className='material-icons seeker' onClick={() => this.seek(-1)}>arrow_back</button>
            Progress: {idx + 1}/{ncards}
            <button disabled={idx + 1 === ncards} className='material-icons seeker' onClick={() => this.seek(1)}>arrow_forward</button>
            <br />
            <button onClick={this.toggleShuffle}>{this.state.shuffle ? 'Unshuffle!' : 'Shuffle!'}</button>
            <br />
            <br />
            <button onClick={this.toggleShowStarred}>{this.state.showStarred ? 'Display all' : 'Only display starred'}</button>
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
  const description = deck && deck.description;
  return { name, description, cards };
}

export default compose(
  withRouter,
  firebaseConnect(props => {
    const deckId = props.match.params.deckId;
    return [{ path: `/flashcards/${deckId}`, storeAs: deckId }];
  }),
  connect(mapStateToProps),
)(CardViewer);