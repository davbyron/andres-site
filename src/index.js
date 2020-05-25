import React from 'react';
import ReactDOM from 'react-dom';
import About from './About.js';
import Languages from './Languages.js';
import Pubs from './Pubs.js';
import Unpubs from './Unpubs.js';
import './index.css';

// Initial render
ReactDOM.render(
  <React.StrictMode>
    <About />
  </React.StrictMode>,
  document.getElementById('panel')
);

// Retrieve buttons from HTML
const home_button = document.getElementById('home_button');
const langs_button = document.getElementById('langs_button');
const pubs_button = document.getElementById('pubs_button');
const unpubs_button = document.getElementById('unpubs_button');

// Create event handlers for each button
home_button.onclick = () => {
  ReactDOM.render(
    <React.StrictMode>
      <About />
    </React.StrictMode>,
    document.getElementById('panel')
  );
}

langs_button.onclick = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Languages />
    </React.StrictMode>,
    document.getElementById('panel')
  );
}

pubs_button.onclick = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Pubs />
    </React.StrictMode>,
    document.getElementById('panel')
  );
}

unpubs_button.onclick = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Unpubs />
    </React.StrictMode>,
    document.getElementById('panel')
  );
}
