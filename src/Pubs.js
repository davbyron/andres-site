import React from 'react';
import './Pubs.css';

function Pubs(props) {
  return (
    <section class="publications">
      <div class="title">publications</div>
      <div class="body">
        <div class="pub" id="profiling">
          <div class="year">2021</div>
          <div class="authors">Gregory Guy & <b>Andre Schwab</b></div>
          <div class="info">
            <em>The politics of dialect profiling.</em> International Society of Applied Linguistics 12.
          </div>
        </div>
        <div class="pub" id="isiXhosa_kinship">
          <div class="year">2021</div>
          <div class="authors"><b>Andre Schwab</b></div>
          <div class="info">
            <em>Inalienable kinship relations in colloquial isiXhosa: towards a syntactic analysis.</em> Annual Conference on African Linguistics 51-52.
          </div>
        </div>
        <div class="pub" id="thesis">
          <div class="year">2019</div>
          <div class="authors"><b>Andre Schwab</b></div>
          <div class="info">
            <em>Dialectal Priming Effects in Political Call Surveys: The Case of Dexter, Maine.</em> M.A. Thesis. NYU.
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pubs;
