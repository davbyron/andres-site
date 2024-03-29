import React from 'react';
import ReactDOM from 'react-dom';
import About from './About.js';
import Languages from './Languages.js';
import Research from './Research.js';
import Unpubs from './Unpubs.js';
import Vowels from './Vowels.js';
import pdf from './cv.pdf';
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
const research_button = document.getElementById('research_button');
const unpubs_button = document.getElementById('unpubs_button');
const vowels_button = document.getElementById('vowels_button');

const cv = document.getElementById('cv');

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

research_button.onclick = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Research />
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

vowels_button.onclick = () => {
  ReactDOM.render(
    <React.StrictMode>
      <Vowels />
    </React.StrictMode>,
    document.getElementById('panel')
  );
}

cv.onclick = () => { window.open(pdf) };
