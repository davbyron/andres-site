import React from 'react';
import './Unpubs.css';

function Unpubs(props) {
  return (
    <section className="unpublications">
      <div className="title">unpublications</div>
      <div className="body">
        <div className="unpub" id="gui">
          <div className="year">2018</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <em><a href="https://sites.google.com/site/thekhoisanlanguages/central-khoisan/gui">Grammatical Sketch of G|ui.</a></em>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Unpubs;
