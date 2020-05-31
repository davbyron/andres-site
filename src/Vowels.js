import React, { Component } from 'react';
import { scroller } from 'react-scroll';
import { getOffset } from './get_offset.mjs';
import { vhToPx } from './measurement_adjustments.mjs';
import { createClickHandler } from './scroll_to_on_click.mjs';
import './Vowels.css';

class Vowels extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: true };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

    const rowOne = vhToPx(55)
    const rowTwo = vhToPx(90);
    const rowThree = vhToPx(125);
    const rowFour = vhToPx(160);
    const rowFive = vhToPx(195);
    const rowSix = vhToPx(232);
    const rowSeven = vhToPx(269);
    const rowEight = vhToPx(300);

    createClickHandler(document.getElementById('li_amharic'), rowOne, 0);
    createClickHandler(document.getElementById('li_arabic'), rowOne, 0);
    createClickHandler(document.getElementById('li_bahasa'), rowOne, 0);
    createClickHandler(document.getElementById('li_baluchi'), rowOne, 0);

    createClickHandler(document.getElementById('li_cantonese'), rowTwo, 0);
    createClickHandler(document.getElementById('li_english'), rowTwo, 0);
    createClickHandler(document.getElementById('li_french'), rowTwo, 0);
    createClickHandler(document.getElementById('li_german'), rowTwo, 0);

    createClickHandler(document.getElementById('li_italian'), rowThree, 0);
    createClickHandler(document.getElementById('li_japanese'), rowThree, 0);
    createClickHandler(document.getElementById('li_kabardian'), rowThree, 0);
    createClickHandler(document.getElementById('li_kagayanen'), rowThree, 0);

    createClickHandler(document.getElementById('li_kazakh'), rowFour, 0);
    createClickHandler(document.getElementById('li_korean'), rowFour, 0);
    createClickHandler(document.getElementById('li_luo'), rowFour, 0);
    createClickHandler(document.getElementById('li_maasai'), rowFour, 0);

    createClickHandler(document.getElementById('li_mixtec'), rowFive, 0);
    createClickHandler(document.getElementById('li_creek'), rowFive, 0);
    createClickHandler(document.getElementById('li_nahuatl'), rowFive, 0);
    createClickHandler(document.getElementById('li_nambo'), rowFive, 0);

    createClickHandler(document.getElementById('li_portuguese_br'), rowSix, 0);
    createClickHandler(document.getElementById('li_portuguese_eu'), rowSix, 0);
    createClickHandler(document.getElementById('li_qiang'), rowSix, 0);
    createClickHandler(document.getElementById('li_russian_cons'), rowSix, 0);

    createClickHandler(document.getElementById('li_russian_vowels'), rowSeven, 0);
    createClickHandler(document.getElementById('li_spanish'), rowSeven, 0);
    createClickHandler(document.getElementById('li_tanana_athabaskan'), rowSeven, 0);
    createClickHandler(document.getElementById('li_thai'), rowSeven, 0);

    createClickHandler(document.getElementById('li_vietnamese'), rowEight, 0);
    createClickHandler(document.getElementById('li_welsh'), rowEight, 0);
  }

  handleClick(e) {
    if (this.state.isVisible) {
      document.getElementById('words').style.display = 'none';
      document.getElementById('minimize').innerHTML = '<i class="far fa-plus-square"></i> maximize explanation';
      document.getElementById('list').style.display = 'block';
    } else {
      document.getElementById('words').style.display = 'inherit';
      document.getElementById('minimize').innerHTML = '<i class="far fa-minus-square"></i> minimize explanation';
      document.getElementById('list').style.display = 'none';
    }

    this.setState(state => ({
      isVisible: !state.isVisible
    }));
  }

  render() {
    return (
      <section className="vowels">
        <div className="title">vowelchArt</div>
        <div className="details">
          <div className="explanation">
            <p>
              <div id="words">
                This is where the explanation will go. And if there are multiple lines they will wrap like this. And this. And this. And this. And this. And this. And this. And this. And this. And this. And this.
                <br/>
                (<a href="#">Works cited</a>)
              </div>
              <div id="minimize" onClick={this.handleClick}><i className="far fa-minus-square"></i> minimize explanation</div>
            </p>
            <div className="chart_list" id="list">
              <p><b>Available Languages:</b></p>
              <ul className="language_list">
                <li id="li_amharic">Amharic</li>
                <li id="li_arabic">Arabic (Jordan)</li>
                <li id="li_bahasa">Bahasa</li>
                <li id="li_baluchi">Baluchi</li>
                <li id="li_cantonese">Cantonese</li>
                <li id="li_english">English</li>
                <li id="li_french">French</li>
                <li id="li_german">German</li>
                <li id="li_italian">Italian</li>
                <li id="li_japanese">Japanese</li>
                <li id="li_kabardian">Kabardian</li>
                <li id="li_kagayanen">Kagayanen</li>
                <li id="li_kazakh">Kazakh</li>
                <li id="li_korean">Korean</li>
                <li id="li_luo">Luo</li>
                <li id="li_maasai">Maasai</li>
                <li id="li_mixtec">Yoloxóchitl Mixtec</li>
                <li id="li_nahuatl">Nahuatl</li>
                <li id="li_nambo">Nambo</li>
                <li id="li_creek">Muskogee Creek</li>
                <li id="li_portuguese_br">Portuguese (Brazil)</li>
                <li id="li_portuguese_eu">Portuguese (Portugal)</li>
                <li id="li_qiang">Qiang (Hongyan)</li>
                <li id="li_russian_cons">Russian (Consonants)</li>
                <li id="li_russian_vowels">Russian (Vowels)</li>
                <li id="li_spanish">Spanish</li>
                <li id="li_tanana_athabaskan">Tanana Athabaskan</li>
                <li id="li_thai">Thai</li>
                <li id="li_vietnamese">Vietnamese</li>
                <li id="li_welsh">Welsh</li>
              </ul>
            </div>
          </div>
          <img src="./images/french.png" alt="French" className="sample"/>
        </div>
        <div className="charts">
          <div className="tile" id="amharic">
            <img src="./images/amharic.png" alt="Amharic" className="vowelchart"/>
            <div className="chart_title"><b>Amharic</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="arabic">
            <img src="./images/arabic_jd.png" alt="Arabic (Jordan)" className="vowelchart"/>
            <div className="chart_title"><b>Arabic (Jordan)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="bahasa">
            <img src="./images/bahasa.png" alt="Bahasa" className="vowelchart"/>
            <div className="chart_title"><b>Bahasa</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="baluchi">
            <img src="./images/baluchi.png" alt="Baluchi" className="vowelchart"/>
            <div className="chart_title"><b>Baluchi</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="cantonese">
            <img src="./images/cantonese.png" alt="Cantonese" className="vowelchart"/>
            <div className="chart_title"><b>Cantonese</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="english">
            <img src="./images/english_m.png" alt="English" className="vowelchart"/>
            <div className="chart_title"><b>English</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="french">
            <img src="./images/french.png" alt="French" className="vowelchart"/>
            <div className="chart_title"><b>French</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="german">
            <img src="./images/german_fem.png" alt="German" className="vowelchart"/>
            <div className="chart_title"><b>German</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="italian">
            <img src="./images/italian.png" alt="Italian" className="vowelchart"/>
            <div className="chart_title"><b>Italian</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="japanese">
            <img src="./images/japanese.png" alt="Japanese" className="vowelchart"/>
            <div className="chart_title"><b>Japanese</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="kabardian">
            <img src="./images/kabardian.png" alt="Kabardian" className="vowelchart"/>
            <div className="chart_title"><b>Kabardian</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="kagayanen">
            <img src="./images/kagayanen.png" alt="Kagayanen" className="vowelchart"/>
            <div className="chart_title"><b>Kagayanen</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="kazakh">
            <img src="./images/kazakh.png" alt="Kazakh" className="vowelchart"/>
            <div className="chart_title"><b>Kazakh</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="korean">
            <img src="./images/korean.png" alt="Korean" className="vowelchart"/>
            <div className="chart_title"><b>Korean</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="luo">
            <img src="./images/luo.png" alt="Luo" className="vowelchart"/>
            <div className="chart_title"><b>Luo</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="maasai">
            <img src="./images/maasai.png" alt="Maasai" className="vowelchart"/>
            <div className="chart_title"><b>Maasai</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="mixtec">
            <img src="./images/mixtec.png" alt="Yoloxóchitl Mixtec" className="vowelchart"/>
            <div className="chart_title"><b>Yoloxóchitl Mixtec</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="creek">
            <img src="./images/muskogee_creek.png" alt="Muskogee Creek" className="vowelchart"/>
            <div className="chart_title"><b>Muskogee Creek</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="nahuatl">
            <img src="./images/nahuatl.png" alt="Nahuatl" className="vowelchart"/>
            <div className="chart_title"><b>Nahuatl</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="nambo">
            <img src="./images/nambo.png" alt="Nambo" className="vowelchart"/>
            <div className="chart_title"><b>Nambo</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="portuguese_br">
            <img src="./images/portuguese_br.png" alt="Portuguese (Brazil)" className="vowelchart"/>
            <div className="chart_title"><b>Portuguese (Brazil)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="portuguese_eu">
            <img src="./images/portuguese_eu.png" alt="Portuguese (Portugal)" className="vowelchart"/>
            <div className="chart_title"><b>Portuguese (Portugal)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="qiang_hongyan">
            <img src="./images/qiang_hongyan.png" alt="Qiang (Hongyan)" className="vowelchart"/>
            <div className="chart_title"><b>Qiang (Hongyan)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="russian_consonants">
            <img src="./images/russian_consonants.png" alt="Russian (Consonants)" className="vowelchart"/>
            <div className="chart_title"><b>Russian (Consonants)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="russian">
            <img src="./images/russian.png" alt="Russian (Vowels)" className="vowelchart"/>
            <div className="chart_title"><b>Russian (Vowels)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="spanish">
            <img src="./images/spanish.png" alt="Spanish" className="vowelchart"/>
            <div className="chart_title"><b>Spanish</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="tanana_athabaskan">
            <img src="./images/tanana_athabaskan.png" alt="Tanana Athabaskan" className="vowelchart"/>
            <div className="chart_title"><b>Tanana Athabaskan</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="thai">
            <img src="./images/thai.png" alt="Thai" className="vowelchart"/>
            <div className="chart_title"><b>Thai</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="vietnamese">
            <img src="./images/vietnamese.png" alt="Vietnamese" className="vowelchart"/>
            <div className="chart_title"><b>Vietnamese</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
          <div className="tile" id="welsh">
            <img src="./images/welsh.png" alt="Welsh" className="vowelchart"/>
            <div className="chart_title"><b>Welsh</b></div>
            <div className="chart_info">
              example example example
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Vowels;
