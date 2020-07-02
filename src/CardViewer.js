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
      idx: 0,           // display index
      showFront: true,
      shuffle: false,
      showStarred: false,
      cards: [],
      order: [],        // mapping from display index to firebase index
      starredIdxs: [],  // array of firebase indices of starred cards
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentDidUpdate = prevProps => {
    if (this.props.cards && this.props.cards !== prevProps.cards) {
      const idx = Math.min(this.state.idx, this.props.cards.length - 1);
      const order = this.state.order.length === 0 ? [...Array(this.props.cards.length).keys()] : this.state.order;
      const starredIdxs = [...Array(this.props.cards.length).keys()].filter(idx => this.props.cards[idx].starred).sort((i, j) => order.indexOf(i) - order.indexOf(j));
      this.setState({
        idx: idx,
        cards: this.props.cards,
        order: order,
        starredIdxs,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  flipCard = () => {
    this.setState({ showFront: !this.state.showFront });
  }

  star = event => {
    const index = this.state.showStarred ? this.state.starredIdxs[this.state.idx] : this.state.order[this.state.idx];   // firebase index
    // Handle attempt to unstar only starred cared in showStarred mode
    if (this.state.showStarred && this.state.starredIdxs.length === 1) {
      alert('Error. Only one starred card left. Please display all cards to unstar.');
    } else {
      // Handle unstarring last card in showStarred mode
      const ncards = this.state.showStarred ? this.state.starredIdxs.length : this.state.cards.length;
      if (this.state.showStarred && this.state.idx == ncards - 1) {
        this.setState({ idx: ncards - 2 });
      }
      // Update firebase
      const deckId = this.props.match.params.deckId;
      this.props.firebase.update(
        `/flashcards/${deckId}/cards/${index}`,
        { starred: !this.state.cards[index].starred },
      );
    }
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
    const order = shuffle ? this.state.order.slice().sort(() => Math.random() - 0.5) : [...Array(this.state.cards.length).keys()]
    const starredIdxs = [...Array(this.props.cards.length).keys()].filter(idx => this.props.cards[idx].starred).sort((i, j) => order.indexOf(i) - order.indexOf(j));
    this.setState({
      idx: 0,
      showFront: true,
      shuffle,
      order,
      starredIdxs,
    });
  }

  toggleShowStarred = () => {
    const showStarred = !this.state.showStarred;
    if (showStarred) {
      const starredIdxs = this.state.starredIdxs.slice().sort((i, j) => this.state.order.indexOf(i) - this.state.order.indexOf(j));
      this.setState({ starredIdxs });
    } 
    this.setState({
      idx: 0,
      showStarred,
      showFront: true,
    });
  }

  onKeyDown = event => {
    const ncards = this.state.showStarred ? this.state.starredIdxs.length : this.state.cards.length;
    if (event.keyCode === 37 && this.state.idx > 0) {
      this.seek(-1);
    }
    else if (event.keyCode === 39 && this.state.idx + 1 < ncards) {
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

    const idx = this.state.idx;               // display index
    const index = this.state.showStarred ? this.state.starredIdxs[this.state.idx] : this.state.order[idx];      // firebase index
    const card = this.state.cards[index];
    const ncards = this.state.showStarred ? this.state.starredIdxs.length : this.state.cards.length;
    console.log({idx, index, card, cards: this.state.cards, order: this.state.order});

    return (
      <div>
        <h1><Link to='/'>Flashcards</Link></h1>
        <h2>{this.props.name}</h2>
        <p>{this.props.description}</p>

        {ncards > 0 &&
          <div className='viewer'>
            <div className='card' onClick={this.flipCard}>
              <span className='material-icons star' onClick={this.star}>
                {this.state.cards[index].starred ? 'star' : 'star_outline'}
              </span>
              <div className='card-content'>
                {this.state.showFront ? card.front : card.back}
              </div>
            </div>
            <button disabled={idx === 0} className='material-icons seeker' onClick={() => this.seek(-1)}>
              arrow_back
            </button>
            Progress: {idx + 1}/{ncards}
            <button disabled={idx + 1 === ncards} className='material-icons seeker' onClick={() => this.seek(1)}>
              arrow_forward
            </button>
            <br />
            <button onClick={this.toggleShuffle}>
              {this.state.shuffle ? 'Unshuffle!' : 'Shuffle!'}
            </button>
            <br />
            <br />
            <button disabled={this.state.starredIdxs.length === 0} onClick={this.toggleShowStarred}>
              {this.state.showStarred ? 'Display all' : 'Only display starred'}
            </button>
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