import React from 'react';
import './Unpubs.css';

function Unpubs(props) {
  return (
    <section class="unpublications">
      <div class="title">unpublications</div>
      <div class="body">
        <div class="unpub" id="gui">
          <div class="year">2018</div>
          <div class="authors"><b>Andre Schwab</b></div>
          <div class="info">
            <em><a href="https://sites.google.com/site/thekhoisanlanguages/central-khoisan/gui">Grammatical Sketch of G|ui.</a></em>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Unpubs;
