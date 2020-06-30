import React from 'react';
import './Homepage.css';

import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';

class Homepage extends React.Component {
  render() {
    if (!isLoaded(this.props.names)) {
      return <div>Loading...</div>;
    }

    const deckLinks = Object.keys(this.props.names).map(deckId => {
      return (
          <Link key={deckId} className='flex-item' to={'/viewer/' + deckId}>
            {this.props.names[deckId]['name']}
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
  const names = state.firebase.data.homepage;
  return { names };
}

export default compose(firebaseConnect(['/homepage']), connect(mapStateToProps))(Homepage);