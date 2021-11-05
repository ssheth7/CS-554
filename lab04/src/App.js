import React from 'react';
import { BrowserRouter as Router, Route, Link , Switch} from 'react-router-dom';

import './App.css';

import CharactersPages from './components/CharactersPages';
import Characters from './components/Characters';
import SeriesPages from './components/SeriesPages';
import Series from './components/Series'
import ComicsPages from './components/ComicsPages'
import Comics from './components/Comics';

import Home from './components/Home';
import Error from './components/Error'


const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Front end for Marvels dev API
          </h1>
          <Link className="headerlink" to="/">
            Home
          </Link>
          <Link className="headerlink" to="/series/page/0">
            Series
          </Link>
          <Link className="headerlink" to="/characters/page/0">
            Characters
          </Link>
          <Link className="headerlink" to="/comics/page/0">
            Comics
          </Link>
        </header>
        <br />
        <br />
        <div className="App-body">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/characters/page/:id" component={CharactersPages} />
            <Route exact path="/characters/:id" component={Characters} />            
            <Route exact path="/comics/page/:id" component={ComicsPages} />
            <Route exact path="/comics/:id" component={Comics} />            
            <Route exact path="/series/page/:id" component={SeriesPages} />
            <Route exact path="/series/:id" component={Series} />            
            <Route exact path="*" component={Error}/>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
