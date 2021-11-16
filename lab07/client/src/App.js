import React from 'react';
import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Link , Switch} from 'react-router-dom';
import './App.css';

import Error from './components/Error'
import Home from './components/Home';
import Pokemon from './components/Pokemon';
import PokemonPages from './components/PokemonPages';
import Trainers from './components/Trainers';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">
              Pokemon App
            </h1>
            <Link className="headerlink" to="/">
              Home
            </Link>
            <Link className="headerlink" to="/trainers">
              Trainers
            </Link>
            <Link className="headerlink" to="/pokemon/page/1">
              Pokemon
            </Link>
            <h2 className="App-title">Click the tabs to see trainers or pokemon!</h2>
          </header>
          <br></br>
          <div className="App-body">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/trainers" component={Trainers} />
              <Route exact path="/pokemon/page/:id" component={PokemonPages} />
              <Route exact path="/pokemon/:id" component={Pokemon} />
              <Route exact path="*" component={Error}/>
            </Switch>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
