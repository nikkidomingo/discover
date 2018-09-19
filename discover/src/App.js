import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Welcome from './Welcome'
import Home from './Home'

const App = () => (
    <Router>
        <div>
            <Route exact path="/" component={Welcome} />
            <Route path="/home" component={Home} />
        </div>
    </Router>
)

export default App;