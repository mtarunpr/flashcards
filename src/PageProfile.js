import React from 'react';
import './PageProfile.css';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

class PageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  save = () => {
    this.props.firebase.updateProfile({ username: this.state.username });
  }

  render() {
    if (!this.props.uid) {
      return <Redirect to='/register' />;
    }

    return (
      <div>
        <h2>Profile</h2>
        <table>
          <tbody>
            <tr>
              <td>Email:</td>
              <td>
                <input disabled value={this.props.email} />
                {this.props.confirmed ? '' : '(unconfirmed)'}
              </td>
            </tr>
            <tr>
              <td>Username:</td>
              <td><input name='username' onChange={this.handleChange} value={this.state.username} /></td>
            </tr>
          </tbody>
        </table>
        <br />
        <button disabled={this.state.username === this.props.username} onClick={this.save}>Save</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uid: state.firebase.auth.uid,
    username: state.firebase.profile.username,
    email: state.firebase.profile.email,
    confirmed: state.firebase.profile.confirmed,
  };
}

export default compose(firebaseConnect(), connect(mapStateToProps))(PageProfile);