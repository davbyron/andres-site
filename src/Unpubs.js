import React from 'react';
import './Unpubs.css';

// Create dict with locations for all files.
// To access an image from cache, e.g.: <a href={cache['./thesis.pdf']}></a>
const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

// Only accepts .png files. Can be changed if necessary.
importAll(require.context('./unpubs/', false, /\.pdf$/));

function Unpubs(props) {
  return (
    <section className="unpublications">
      <div className="title">unpublished</div>
      <div className="body">
      <div className="unpub" id="bridgegate">
        <div className="year">2020</div>
        <div className="authors"><b>Andre Schwab</b></div>
        <div className="info">
          <em><a href={cache['./bridgegate.pdf']}>Chris Christie and Bridgegate.</a></em>
        </div>
      </div>
      <div className="unpub" id="queens">
        <div className="year">2020</div>
        <div className="authors"><b>Andre Schwab</b></div>
        <div className="info">
          <em><a href={cache['./queens.pdf']}>Drag Queens and Complex Positioning.</a></em>
        </div>
      </div>
      <div className="unpub" id="arabic_sibilants">
        <div className="year">2019</div>
        <div className="authors">Teddy Manning, Kevin Samejon, Miriam Yifach, & <b>Andre Schwab</b></div>
        <div className="info">
          <em><a href={cache['./arabic_sibilants.pdf']}>The Interaction of Sibilants and IP Boundaries in Egyptian Arabic.</a></em>
        </div>
      </div>
        <div className="unpub" id="gui">
          <div className="year">2018</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <em><a href="https://sites.google.com/site/thekhoisanlanguages/central-khoisan/gui">Grammatical Sketch of G|ui.</a></em>
          </div>
        </div>
        <div className="unpub" id="fribourg">
          <div className="year">2018</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <em><a href={cache['./fribourg.pdf']}>Linguistic tension in the Fribourg area of Switzerland.</a></em>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Unpubs;
