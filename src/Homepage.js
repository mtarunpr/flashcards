import React from 'react';
import './Homepage.css';

import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';

class Homepage extends React.Component {
  getDeckHtml = deckId => {
    return (
      <Link key={deckId} className='flex-item' to={'/viewer/' + deckId}>
        <div className='name'>
          {this.props.decks[deckId]['name']}
        </div>
        <br />
        <div className='description'>
          {this.props.decks[deckId]['description']}
        </div>
      </Link>
    );
  }

  render() {
    if (!isLoaded(this.props.decks)) {
      return <div>Loading...</div>;
    }

    const myDecks = Object.keys(this.props.decks).filter(
      deckId => this.props.decks[deckId].owner === this.props.uid
    ).map(this.getDeckHtml);

    const publicDecks = Object.keys(this.props.decks).filter(
      deckId => (
        this.props.decks[deckId].owner !== this.props.uid
        && this.props.decks[deckId].public
      )
    ).map(this.getDeckHtml);

    return (
      <div>
        <h2>My Decks</h2>
        <div className='flex-container'>
          {myDecks.length ? myDecks : 'You have not created any decks. Create one now!'}
        </div>

        <Link style={{ marginLeft: '20px' }} className='material-icons new-btn' to='/editor'>add_circle</Link>

        <h2>Public Decks</h2>
        <div className='flex-container'>
          {publicDecks.length ? publicDecks : 'There are no public decks created by others.'}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const decks = state.firebase.data.homepage;
  const uid = state.firebase.auth.uid;
  return { decks, uid };
}

export default compose(firebaseConnect(['/homepage']), connect(mapStateToProps))(Homepage);