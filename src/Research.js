import React from 'react';
import './Research.css';

// Create dict with locations for all files.
// To access an image from cache, e.g.: <a href={cache['./thesis.pdf']}></a>
const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

// Only accepts .png files. Can be changed if necessary.
importAll(require.context('./pubs/', false, /\.pdf$/));

function Research(props) {
  return (
    <section className="research">
      <div className="title">research</div>
      <div className="body">
        <div className="topic" id="qp2">
          <div className="year">2022</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <em><a href={cache['./qp2.pdf']}>Teaching Possession Splits to Anglophones: An Investigation</a></em> M.A. Qualifying Paper. Boston University.
          </div>
        </div>
        <div className="topic" id="qp1">
          <div className="year">2021</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <em><a href={cache['./qp1.pdf']}>Love Is Possessive: An Alternative Way Of Encoding Endearment</a></em> M.A. Qualifying Paper. Boston University.
          </div>
        </div>
        <div className="topic" id="isiXhosa_kinship">
          <div className="year">2021</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <em>Inalienable kinship relations in colloquial isiXhosa: towards a syntactic analysis.</em> Annual Conference on African Linguistics 51-52.
          </div>
        </div>
        <div className="topic" id="thesis">
          <div className="year">2019</div>
          <div className="authors"><b>Andre Schwab</b></div>
          <div className="info">
            <em><a href={cache['./thesis.pdf']}>Dialectal Priming Effects in Political Call Surveys: The Case of Dexter, Maine.</a></em> M.A. Thesis. New York University.
          </div>
        </div>
      </div>
    </section>
  )
}

export default Research;
