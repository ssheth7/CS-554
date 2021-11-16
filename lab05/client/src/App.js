import React from 'react';
import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Link , Switch} from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Error from './components/Error'
import NewPost from './components/NewPost'
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
              Binterest
            </h1>
            <Link className="headerlink" to="/">
              Home
            </Link>
            <Link className="headerlink" to="/my-bin">
              My bins
            </Link>
            <Link className="headerlink" to="/my-posts">
              My Posts
            </Link>
            <Link className="headerlink" to="new-post">
              Create Posts
            </Link>
            <h2 className="App-title">Click the tabs to see more of your Binterest page!</h2>
          </header>
          <br></br>
          <div className="App-body">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/my-bin" component={Home} />
              <Route exact path="/my-posts" component={Home} />
              <Route exact path="/new-post" component={NewPost} />
              <Route exact path="*" component={Error}/>
            </Switch>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
