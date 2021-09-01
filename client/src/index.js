import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { NavBar, Header } from './components/Header/Header.js';
// import App  from './chat.js';
import 'react-chat-widget/lib/styles.css';




import reportWebVitals from './reportWebVitals';

ReactDOM.render(<Header />, document.getElementById('app_header'));
ReactDOM.render(<NavBar />, document.getElementById('nav_bar'));
// ReactDOM.render(<App />, document.getElementById('root'));



reportWebVitals();


