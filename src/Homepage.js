import React from 'react';
import './Homepage.css';

import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: {},
    };
  }

  async componentDidMount() {
    const getHomepage = this.props.firebase.functions().httpsCallable('getHomepage');
    const decks = await getHomepage();
    this.setState({ decks: decks.data });
  }

  getDeckHtml = deckId => {
    return (
      <Link key={deckId} className='flex-item' to={'/viewer/' + deckId}>
        <div className='name'>
          {this.state.decks[deckId]['name']}
        </div>
        <br />
        <div className='description'>
          {this.state.decks[deckId]['description']}
        </div>
      </Link>
    );
  }

  render() {
    if (!isLoaded(this.state.decks)) {
      return <div>Loading...</div>;
    }

    const myDecks = Object.keys(this.state.decks).filter(
      deckId => this.state.decks[deckId].owner === this.state.uid
    ).map(this.getDeckHtml);

    const publicDecks = Object.keys(this.state.decks).filter(
      deckId => (
        this.state.decks[deckId].owner !== this.props.uid
        && this.state.decks[deckId].public
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
  return { uid: state.firebase.auth.uid };
}

export default compose(firebaseConnect(), connect(mapStateToProps))(Homepage);