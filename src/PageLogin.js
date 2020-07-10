import React from 'react';

import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect, Link } from 'react-router-dom';

class PageLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, error: '' });
  }

  login = async () => {
    const credentials = {
      email: this.state.email,
      password: this.state.password,
    };

    try {
      await this.props.firebase.login(credentials);
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
        <h2>Login</h2>
        <div>
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
        <button onClick={this.login}>Login</button>
        {
          this.state.error &&
          <div>
            <br />
            {this.state.error}
          </div>
        }
        <div>
          <br />
          Don't have an account yet? Click <Link to='/register' className='link'>here</Link> to register.
        </div>
        <hr />
        <Link to='/' className='link-btn'>Home</Link>
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
)(PageLogin);