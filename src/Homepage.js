import React from 'react';
import { Link } from 'react-router-dom';

class Homepage extends React.Component {
  render() {
    return (
      <div>
        <h1><Link to='/'>Flashcards</Link></h1>
        <Link className='link-btn' to='/editor'>Card Editor</Link>
        <Link className='link-btn' to='/viewer'>Card Viewer</Link>
      </div>
    );
  }
}

export default Homepage;