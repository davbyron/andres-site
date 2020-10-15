import React from 'react';
import './About.css';

function About(props) {
  return (
    <section className="about">
      <div className="title">about</div>
      <div className="body">
        <p>
          I'm a student at Boston University (BU) in the Graduate School of Arts
          and Science pursuing a doctorate (PhD) in Linguistics. My academic
          interests include sociolinguistics, phonetics, phonology,
          migration studies, and understudied languages and language varieties.
          My biggest current projects are documenting Cua (Kalahari Khoe) in
          Botswana and exploring microcomparative variation in affectionate
          kinship constructions across South Bantu languages which seem to rely
          on inalienable syntactic structures.
        </p>
      </div>
    </section>
  )
}

export default About;
