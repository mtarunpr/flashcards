import React from 'react';

import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect, Link } from 'react-router-dom';

class PageRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      error: '',
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, error: '' });
  }

  register = async () => {
    const credentials = {
      email: this.state.email,
      password: this.state.password,
    };

    const profile = {
      email: this.state.email,
      username: this.state.username,
      confirmed: false,
    }

    try {
      await this.props.firebase.createUser(credentials, profile);
      await this.props.firebase.auth().currentUser.sendEmailVerification();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    if (this.props.isLoggedIn) {
      if (this.props.confirmed) {
        return <Redirect to='/' />;
      } else {
        return (
          <div>
            <p>A verification email has been sent to your registered address. Please click on the link in the email to continue.</p>
            <p>Note: you cannot create decks until your email address has been verified.</p>
          </div>
        );
      }
    }

    return (
      <div>
        <h2>Register</h2>
        <div>
          <input
            name='username'
            onChange={this.handleChange}
            placeholder='Username'
            value={this.state.username}
          />
          <br />
          <br />
          <input
            name='email'
            onChange={this.handleChange}
            placeholder='Email'
            value={this.state.email}
          />
          <br />
          <br />
          <input
            name='password'
            type='password'
            onChange={this.handleChange}
            placeholder='Password'
            value={this.state.password}
          />
        </div>
        <br />
        <button
          disabled={!this.state.username.trim()}
          onClick={this.register}
        >
          Register
        </button>
        {
          this.state.error &&
          <div>
            <br />
            {this.state.error}
          </div>
        }
        <div>
          <br />
          Already have an account? Click <Link to='/login' className='link'>here</Link> to login.
        </div>
        <hr />
        <Link to='/' className='link-btn'>Home</Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.firebase.auth.uid,
    confirmed: state.firebase.profile.confirmed,
  };
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(PageRegister);