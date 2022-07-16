import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ScreenHome from './ScreenHome';
import ScreenArticlesBySource from './ScreenArticlesBySource';
import ScreenSource from './ScreenSource';
import ScreenMyArticles from './ScreenMyArticles';
import { createStore, combineReducers } from 'redux';
import articleWishlist from './reducers/article.reducer';
import token from './reducers/token.reducer';
import language from './reducers/language.reducer';
import { Provider } from 'react-redux';

const store = createStore(combineReducers({ articleWishlist, token, language })); //deprecated

function App() {
  return (

      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path='/' component={ScreenHome} />
            <Route path='/screenarticlesbysource/:id' component={ScreenArticlesBySource} />
            <Route path='/screensource' component={ScreenSource} />
            <Route path='/screenmyarticles/' component={ScreenMyArticles} />
          </Switch>
        </Router>
      </Provider>

  );
}

export default App;
