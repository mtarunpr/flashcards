import React from 'react';
import './Homepage.css';

import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';

class Homepage extends React.Component {
  render() {
    if (!isLoaded(this.props.decks)) {
      return <div>Loading...</div>;
    }

    const deckLinks = Object.keys(this.props.decks).map(deckId => {
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
    });

    return (
      <div>
        <h1><Link to='/'>Flashcards</Link></h1>
        <div className='flex-container'>
          {deckLinks}
        </div>
        <br />
        <Link style={{marginLeft: '20px'}} className='material-icons new-btn' to='/editor'>add_circle</Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const decks = state.firebase.data.homepage;
  return { decks };
}

export default compose(firebaseConnect(['/homepage']), connect(mapStateToProps))(Homepage);