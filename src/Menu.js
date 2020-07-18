import React from 'react';
import './Menu.css';
import onClickOutside from 'react-onclickoutside';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  toggle = () => {
    this.setState({ show: !this.state.show });
  };

  handleClickOutside = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div className="dropdown menu-right">
        <div onClick={this.toggle} className="dropbtn">
          {this.props.username}
          <span className="material-icons">arrow_drop_down</span>
        </div>
        {this.state.show && (
          <div onClick={this.toggle} className="dropdown-content">
            <Link to="/profile">Profile</Link>
            <span className="span-link" onClick={this.props.logout}>
              Logout
            </span>
          </div>
        )}
      </div>
    );
  }
}

Dropdown = onClickOutside(Dropdown);

class Menu extends React.Component {
  render() {
    return (
      <div className="menu">
        <h1>
          <Link to="/">Flashcards</Link>
        </h1>
        {this.props.uid ? (
          <Dropdown
            logout={this.props.firebase.logout}
            username={this.props.username}
          />
        ) : (
          <div className="menu-right">
            <Link style={{ marginRight: '20px' }} to="/login">
              Login
            </Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.firebase.profile.username,
    uid: state.firebase.auth.uid,
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps))(Menu);
