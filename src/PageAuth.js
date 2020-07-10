import React from 'react';

import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

class PageAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
    }
  }

  componentDidMount = () => {
    const query = new URLSearchParams(this.props.location.search);
    const mode = query.get('mode');
    const oobCode = query.get('oobCode');

    if (mode !== 'verifyEmail') {
      return <div>Error. Invalid mode.</div>;
    }

    this.handleVerifyEmail(oobCode);
  }

  handleVerifyEmail = async oobCode => {
    try {
      await this.props.firebase.auth().applyActionCode(oobCode);
      this.props.firebase.updateProfile({ confirmed: true });
      this.setState({ success: true });
    } catch (error) {
      this.setState({ success: false, error: error.message });
    }
  }

  render() {
    switch (this.state.success) {
      case null:
        return <div>Verifying email...</div>;
      case true:
        return (
          <div>
            <p>Email address verified!</p>
            <p><Link className='link' to='/'>Click here to continue.</Link></p>
          </div>
        );
      case false:
        return <div>Error. {this.state.error}</div>;
      default:
        return <div>Unknown error. Please try again.</div>;
    }
  }
}

export default compose(withRouter, firebaseConnect())(PageAuth);