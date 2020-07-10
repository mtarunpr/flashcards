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
      mode: null,
    }
  }

  componentDidMount = () => {
    const query = new URLSearchParams(this.props.location.search);
    const mode = query.get('mode');
    const oobCode = query.get('oobCode');

    this.setState({ mode });

    if (mode === 'verifyEmail') {
      this.handleVerifyEmail(oobCode);
    }
  }

  handleVerifyEmail = async oobCode => {
    try {
      await this.props.firebase.auth().applyActionCode(oobCode);
      await this.props.firebase.reloadAuth();
      this.setState({ success: true });
    } catch (error) {
      this.setState({ success: false, error: error.message });
    }
  }

  render() {
    if (this.state.mode !== 'verifyEmail') {
      return <div>Error. Invalid mode.</div>;
    }

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
        return (
          <div>
            <p>Error. {this.state.error}</p>
            <p>Please try again.</p>
          </div>
        );
      default:
        return <div>Unknown error. Please try again.</div>;
    }
  }
}

export default compose(withRouter, firebaseConnect())(PageAuth);