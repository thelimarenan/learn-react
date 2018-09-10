import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import App from './App';
import Home from './Home';
import AutorBox from './Autor';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/autor" component={AutorBox} />
            <Route path="/livro" />
        </Route>
    </Router>
    , document.getElementById('root'));
registerServiceWorker();
