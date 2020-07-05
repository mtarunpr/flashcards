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
        <Link style={{ marginLeft: '20px' }} className='material-icons new-btn' to='/editor'>add_circle</Link>
        <h3>Account</h3>
        {
          this.props.isLoggedIn ?
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
  const isLoggedIn = state.firebase.auth.uid;
  return { decks, email, isLoggedIn };
}

export default compose(firebaseConnect(['/homepage']), connect(mapStateToProps))(Homepage);