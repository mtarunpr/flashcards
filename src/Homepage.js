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
        <h1><Link to='/'>Flashcards</Link></h1>

        <h3>My Decks</h3>
        <div className='flex-container'>
          {myDecks.length ? myDecks : 'You have not created any decks. Create one now!'}
        </div>

        <Link style={{ marginLeft: '20px' }} className='material-icons new-btn' to='/editor'>add_circle</Link>

        <h3>Public Decks</h3>
        <div className='flex-container'>
          {publicDecks.length ? publicDecks : 'There are no public decks.'}
        </div>

        <h3>Account</h3>
        {
          this.props.uid ?
            <div>
              <div>{this.props.email}</div>
              <br />
              <button onClick={this.props.firebase.logout}>Logout</button>
            </div> :
            <div>
              <Link to='/login'>Login</Link>
              <br />
              <Link to='/register'>Register</Link>
            </div>
        }

      </div>
    );
  }
}

const mapStateToProps = state => {
  const decks = state.firebase.data.homepage;
  const email = state.firebase.auth.email;
  const uid = state.firebase.auth.uid;
  return { decks, email, uid };
}

export default compose(firebaseConnect(['/homepage']), connect(mapStateToProps))(Homepage);