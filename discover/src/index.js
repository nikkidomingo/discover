import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import Welcome from './Welcome'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();