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
    }

    try {
      await this.props.firebase.createUser(credentials, profile);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    if (this.props.isLoggedIn) {
      return <Redirect to='/' />;
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
        {this.state.error &&
          <div>
            <br />
            {this.state.error}
          </div>
        }
        <hr />
        <Link to='/' className='link-btn'>Home</Link>
        <br />
        <br />
        <Link to='/login' className='link-btn'>Login</Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isLoggedIn: state.firebase.auth.uid };
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(PageRegister);