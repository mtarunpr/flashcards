import React from 'react';
import CardEditor from './CardEditor';
import CardViewer from './CardViewer';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Homepage from './Homepage';

const App = () => {
    return (
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
        <Route>
          <div>Error 404: Page not found.</div>
        </Route>
      </Switch>
    );
}

export default App;
