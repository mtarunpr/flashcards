import React from 'react';
import CardEditor from './CardEditor';
import CardViewer from './CardViewer';
import './App.css';
import Homepage from './Homepage';
import PageRegister from "./PageRegister";
import PageLogin from './PageLogin';
import Menu from './Menu';

import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import PageProfile from './PageProfile';

const App = props => {
  if (!isLoaded(props.auth, props.profile)) {
    return <div>Authentication loading...</div>;
  }

  return (
    <React.Fragment>
      <Menu />

      <div style={{ clear: 'both' }}>
        <Switch>
          <Route exact path='/'>
            <Homepage />
          </Route>
          <Route exact path='/editor'>
            <CardEditor />
          </Route>
          <Route exact path='/viewer/:deckId'>
            <CardViewer />
          </Route>
          <Route exact path='/register'>
            <PageRegister />
          </Route>
          <Route exact path='/login'>
            <PageLogin />
          </Route>
          <Route exact path='/profile'>
            <PageProfile />
          </Route>
          <Route>
            <div>Error 404: Page not found.</div>
          </Route>
        </Switch>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
}

export default connect(mapStateToProps)(App);
