import React from 'react';
import './Research.css';

// Create dict with locations for all files.
// To access an image from cache, e.g.: <a href={cache['./thesis.pdf']}></a>
const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

// Only accepts .pdf files. Can be changed if necessary.
importAll(require.context('./pubs/', false, /\.pdf$/));

function Research() {
  return (
    <section className="research">
      <h2>research</h2>
      <ul id="bibliography">
        <li className="topic" id="qp2">
          <div className="year">2022</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./qp2.pdf']}>Teaching Possession Splits to Anglophones: An Investigation</a></cite> M.A. Qualifying Paper. Boston University.
          </div>
        </li>
        <li className="topic" id="qp1">
          <div className="year">2021</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./qp1.pdf']}>Love Is Possessive: An Alternative Way Of Encoding Endearment</a></cite> M.A. Qualifying Paper. Boston University.
          </div>
        </li>
        <li className="topic" id="isiXhosa_kinship">
          <div className="year">2021</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <cite>Inalienable kinship relations in colloquial isiXhosa: towards a syntactic analysis.</cite> Annual Conference on African Linguistics 51-52.
          </div>
        </li>
        <li className="topic" id="thesis">
          <div className="year">2019</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./thesis.pdf']}>Dialectal Priming Effects in Political Call Surveys: The Case of Dexter, Maine.</a></cite> M.A. Thesis. New York University.
          </div>
        </li>
      </ul>
    </section>
  )
}

export default Research;
