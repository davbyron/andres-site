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
        <li className="topic" id="initiation rites">
          <div className="year">2024</div>
          <div className="authors"><b>André Batchelder-Schwab</b> & Zoliswa Mali</div>
          <div className="info">
            <cite><a href={cache['./initiation_rites_of_isixhosa.pdf']}>Initiation Rites of the IsiXhosa Culture are Education Systems.</a></cite> Journal of the African Language Teachers Association <span className='no-italic'>11. 147-163.</span>
          </div>
        </li>
        <li className="topic" id="tshila">
          <div className="year">2024</div>
          <div className="authors"><b>André Batchelder-Schwab</b> & Chris Collins</div>
          <div className="info">
            <cite><a href={cache['./acal_2024_classification_of_tshila.pdf']}>The Classification of Tshila.</a></cite> Annual Congress of African Linguistics 55.
          </div>
        </li>
        <li className="topic" id="kinande">
          <div className="year">2024</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./nels_54_poster.pdf']}>Spoken, whistled, drummed, and fluted Kinande: An asymmetry for encoding pitch and rhythm.</a></cite> 54th Annual Meeting of the North East Linguistics Society (NELS 54).
          </div>
        </li>
        <li className="topic" id="indonesian_particle_order">
          <div className="year">2024</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./lsa_poster.pdf']}>A Syntactic Explanation of Preverbal Partical Order Variation in Indonesian Corrective Speech Acts.</a></cite>  2024 Annual LSA meeting.
          </div>
        </li>
        <li className="topic" id="truncation_affectation_pain_sBantu">
          <div className="year">2023</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./truncation_affection_pain_southern_bantu.pdf']}>Truncation, Affection, and Pain in Southern Bantu.</a></cite> Linguistique et Langue Africaine, 9(1).
          </div>
        </li>
        <li className="topic" id="prosody_akan-twi">
          <div className="year">2023</div>
          <div className="authors">Jonathan Barnes, <b>André Batchelder-Schwab</b>, & Okrah Oppong</div>
          <div className="info">
            <cite><a href={cache['./pape2023.pdf']}>Phrase-level prosody of Akan-Twi in spoken and whistled modalities.</a></cite> Phonetics and Phonology in Europe (PaPE).
          </div>
        </li>
        <li className="topic" id="indigenous_knowledge_systems">
          <div className="year">2023</div>
          <div className="authors"><b>André Batchelder-Schwab</b> & Zoliswa Mali</div>
          <div className="info">
            <cite><a href={cache['./alta_2023_ngesingesi.pdf']}>Indigenous Knowledge Systems: the Case of IsiXhosa Intonjane and Ulwaluko Rites.</a></cite> 26th Annual Conference of the African Language Teachers Association (ALTA).
          </div>
        </li>
        <li className="topic" id="npomo_teaching_kinship">
          <div className="year">2023</div>
          <div className="authors"><b>André Batchelder-Schwab</b>, Buffie Schmidt, & Cathy O'Connor</div>
          <div className="info">
            <cite>Teaching Kinship in Northern Pomo.</cite> 8th International Conference on Language Documentation and Conservation.
          </div>
        </li>
        <li className="topic" id="npomo_high_school_language_class">
          <div className="year">2023</div>
          <div className="authors">Cathy O'Connor, Buffie Schmidt, <b>André Batchelder-Schwab</b>, & Brady Dailey</div>
          <div className="info">
            <cite>Creating a High School Language Class in a Dormant Indigenous Language: Challenges and Opportunities.</cite> 8th International Conference on Language Documentation and Conservation.
          </div>
        </li>
        <li className="topic" id="authentic_teaching_materials">
          <div className="year">2022</div>
          <div className="authors"><b>André Batchelder-Schwab</b> & Zoliswa Mali</div>
          <div className="info">
            <cite>Using authentic materials and experiences as access points to some Indigenous Knowledge Systems and historic cultural information: sharing student experiences.</cite> Northeast Regional Consortium for Programs in African Languages (NERCPAL).
          </div>
        </li>
        <li className="topic" id="isiXhosa_teaching_materials">
          <div className="year">2022</div>
          <div className="authors"><b>André Batchelder-Schwab</b>, Allison Smith, & Zoliswa Mali</div>
          <div className="info">
            <cite>Ukubaluleka kokusetyenziswa kwezixhobo zokwenene ekufundiseni ulwimi: sizekelisa ngesiXhosa. (The importance of using authentic teaching materials: examples in isiXhosa).</cite> Annual Conference on African Linguistics 51-52.
          </div>
        </li>
        <li className="topic" id="qp2">
          <div className="year">2022</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./qp2.pdf']}>Teaching Possession Splits to Anglophones: An Investigation.</a></cite> M.A. Qualifying Paper. Boston University.
          </div>
        </li>
        <li className="topic" id="qp1">
          <div className="year">2021</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./qp1.pdf']}>Love Is Possessive: An Alternative Way Of Encoding Endearment.</a></cite> M.A. Qualifying Paper. Boston University.
          </div>
        </li>
        <li className="topic" id="isiXhosa_kinship">
          <div className="year">2021</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite>Inalienable kinship relations in colloquial isiXhosa: towards a syntactic analysis.</cite> Annual Conference on African Linguistics 51-52.
          </div>
        </li>
        <li className="topic" id="alienability_southern_bantu">
          <div className="year">2021</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite>Alienability Distinctions in Southern Bantu.</cite> 10th World Congress of African Linguistics (WOCAL).
          </div>
        </li>
        <li className="topic" id="thesis">
          <div className="year">2019</div>
          <div className="authors"><b>André Batchelder-Schwab</b></div>
          <div className="info">
            <cite><a href={cache['./thesis.pdf']}>Dialectal Priming Effects in Political Call Surveys: The Case of Dexter, Maine.</a></cite> M.A. Thesis. New York University.
          </div>
        </li>
      </ul>
    </section>
  )
}

export default Research;
