import React from 'react';
import './Unpubs.css';

// Create dict with locations for all files.
// To access an image from cache, e.g.: <a href={cache['./thesis.pdf']}></a>
const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

// Only accepts .pdf files. Can be changed if necessary.
importAll(require.context('./unpubs/', false, /\.pdf$/));

function Unpubs() {
  return (
    <section className="unpublications">
      <h2>unpublished</h2>
      <ul id="bibliography">
        <li className="unpub" id="classification-of-tshila">
          <div className="year">2025</div>
          <div className="authors"><b>André Batchelder-Schwab</b> & Chris Collins</div>
          <div className="info">
            <cite><a href={cache['./classification_of_tshila.pdf']}>Classification of Tshila.</a></cite>
          </div>
        </li>
        <li className="unpub" id="bridgegate">
          <div className="year">2020</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./bridgegate.pdf']}>Chris Christie and Bridgegate.</a></cite>
          </div>
        </li>
        <li className="unpub" id="queens">
          <div className="year">2020</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./queens.pdf']}>Drag Queens and Complex Positioning.</a></cite>
          </div>
        </li>
        <li className="unpub" id="arabic_sibilants">
          <div className="year">2019</div>
          <div className="authors">Teddy Manning, Kevin Samejon, Miriam Yifach, & <b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./arabic_sibilants.pdf']}>The Interaction of Sibilants and IP Boundaries in Egyptian Arabic.</a></cite>
          </div>
        </li>
        <li className="unpub" id="fribourg">
          <div className="year">2019</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./fribourg.pdf']}>Linguistic tension in the Fribourg area of Switzerland.</a></cite>
          </div>
        </li>
        <li className="unpub" id="gui">
          <div className="year">2018</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href="https://sites.google.com/site/thekhoisanlanguages/central-khoisan/gui">Grammatical Sketch of G|ui.</a></cite>
          </div>
        </li>
      </ul>
    </section>
  )
}

export default Unpubs;
