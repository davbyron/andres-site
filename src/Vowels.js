import React from 'react';
import { Link, Element } from 'react-scroll';
import refs from './vowels_bib.pdf';
import './Vowels.css';


// function rotate(counter, pics, id) {
//   counter++;
//   if (counter === pics.length) {
//     counter = 0;
//   }
//
//   document.getElementById(id).src = pics[counter];
//
//   setTimeout(rotate(counter, pics, id), 1000);
// }

// Create dict with locations for all images.
// To access an image from cache, e.g.: <img src={cache['./lang.png']} />
const cache = {};

function importAll(r) {
  r.keys().forEach(key => cache[key] = r(key));
}

// Only accepts .png files. Can be changed if necessary.
importAll(require.context('./images/', false, /\.png$/));

function choosePic(counter, pics, id) {
  counter = Math.floor(Math.random() * pics.length);
  document.getElementById(id).src = pics[counter];

  // rotate(counter, pics, id);
}

class Vowels extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: true };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    let displayImage = 0;
    let chartImages = [cache['./amharic.png'], cache['./arabic_jd.png'], cache['./bahasa.png'], cache['./baluchi.png'],
                          cache['./cantonese.png'], cache['./english_m.png'], cache['./french.png'], cache['./german_fem.png'],
                          cache['./italian.png'], cache['./japanese.png'], cache['./kabardian.png'], cache['./kagayanen.png'],
                          cache['./kazakh.png'], cache['./korean.png'], cache['./luo.png'], cache['./maasai.png'],
                          cache['./mixtec.png'], cache['./muskogee_creek.png'], cache['./nahuatl.png'], cache['./nambo.png'],
                          cache['./portuguese_br.png'], cache['./portuguese_eu.png'], cache['./qiang_hongyan.png'], cache['./russian_consonants.png'],
                          cache['./russian.png'], cache['./spanish.png'], cache['./tanana_athabaskan.png'], cache['./thai.png'],
                          cache['./vietnamese.png'], cache['./welsh.png']];

    choosePic(displayImage, chartImages, 'sample');

    // let wantedHeight = document.getElementById('sample').scrollHeight;
    // document.getElementById('copyright').style.paddingTop = document.getElementById('sample').scrollHeight.toString() + 'px';
  }

  componentWillUnmount() {
    document.getElementById('copyright').style.visiblity = 'visible';
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
                (<a href={refs}>Works cited</a>)
              </div>
              <div id="minimize" onClick={this.handleClick}><i className="far fa-minus-square"></i> minimize explanation</div>
            </p>
            <div className="chart_list" id="list">
              <p><b>Available Languages:</b></p>
              <ul className="language_list">
                <li><Link to="amharic" smooth="easeInOutQuint">Amharic</Link></li>
                <li><Link to="arabic" smooth="easeInOutQuint">Arabic (Jordan)</Link></li>
                <li><Link to="bahasa" smooth="easeInOutQuint">Bahasa</Link></li>
                <li><Link to="baluchi" smooth="easeInOutQuint">Baluchi</Link></li>
                <li><Link to="cantonese" smooth="easeInOutQuint">Cantonese</Link></li>
                <li><Link to="english" smooth="easeInOutQuint">English</Link></li>
                <li><Link to="french" smooth="easeInOutQuint">French</Link></li>
                <li><Link to="german" smooth="easeInOutQuint">German</Link></li>
                <li><Link to="greek" smooth="easeInOutQuint">Greek</Link></li>
                <li><Link to="italian" smooth="easeInOutQuint">Italian</Link></li>
                <li><Link to="japanese" smooth="easeInOutQuint">Japanese</Link></li>
                <li><Link to="kabardian" smooth="easeInOutQuint">Kabardian</Link></li>
                <li><Link to="kagayanen" smooth="easeInOutQuint">Kagayanen</Link></li>
                <li><Link to="kazakh" smooth="easeInOutQuint">Kazakh</Link></li>
                <li><Link to="korean" smooth="easeInOutQuint">Korean</Link></li>
                <li><Link to="luo" smooth="easeInOutQuint">Luo</Link></li>
                <li><Link to="maasai" smooth="easeInOutQuint">Maasai</Link></li>
                <li><Link to="mixtec" smooth="easeInOutQuint">Yoloxóchitl Mixtec</Link></li>
                <li><Link to="nahuatl" smooth="easeInOutQuint">Nahuatl</Link></li>
                <li><Link to="nambo" smooth="easeInOutQuint">Nambo</Link></li>
                <li><Link to="creek" smooth="easeInOutQuint">Muskogee Creek</Link></li>
                <li><Link to="portuguese_br" smooth="easeInOutQuint">Portuguese (Brazil)</Link></li>
                <li><Link to="portuguese_eu" smooth="easeInOutQuint">Portuguese (Portugal)</Link></li>
                <li><Link to="qiang_hongyan" smooth="easeInOutQuint">Qiang (Hongyan)</Link></li>
                <li><Link to="russian_consonants" smooth="easeInOutQuint">Russian (Consonants)</Link></li>
                <li><Link to="russian" smooth="easeInOutQuint">Russian (Vowels)</Link></li>
                <li><Link to="spanish" smooth="easeInOutQuint">Spanish</Link></li>
                <li><Link to="tanana_athabaskan" smooth="easeInOutQuint">Tanana Athabaskan</Link></li>
                <li><Link to="thai" smooth="easeInOutQuint">Thai</Link></li>
                <li><Link to="vietnamese" smooth="easeInOutQuint">Vietnamese</Link></li>
                <li><Link to="welsh" smooth="easeInOutQuint">Welsh</Link></li>
              </ul>
            </div>
          </div>
          <img src={cache['./french.png']} alt="French" className="sample" id="sample"/>
        </div>
        <div className="charts" id="collage">
          <Element className="tile" name="amharic">
            <img src={cache["./amharic.png"]} alt="Amharic" className="vowelchart"/>
            <div className="chart_title"><b>Amharic</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="arabic">
            <img src={cache["./arabic_jd.png"]} alt="Arabic (Jordan)" className="vowelchart"/>
            <div className="chart_title"><b>Arabic (Jordan)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="bahasa">
            <img src={cache["./bahasa.png"]} alt="Bahasa" className="vowelchart"/>
            <div className="chart_title"><b>Bahasa</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="baluchi">
            <img src={cache["./baluchi.png"]} alt="Baluchi" className="vowelchart"/>
            <div className="chart_title"><b>Baluchi</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="cantonese">
            <img src={cache["./cantonese.png"]} alt="Cantonese" className="vowelchart"/>
            <div className="chart_title"><b>Cantonese</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="english">
            <img src={cache["./english_m.png"]} alt="English" className="vowelchart"/>
            <div className="chart_title"><b>English</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="french">
            <img src={cache["./french.png"]} alt="French" className="vowelchart"/>
            <div className="chart_title"><b>French</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="german">
            <img src={cache["./german_fem.png"]} alt="German" className="vowelchart"/>
            <div className="chart_title"><b>German</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="greek">
            <img src={cache["./greek.png"]} alt="Greek" className="vowelchart"/>
            <div className="chart_title"><b>Greek</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="italian">
            <img src={cache["./italian.png"]} alt="Italian" className="vowelchart"/>
            <div className="chart_title"><b>Italian</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="japanese">
            <img src={cache["./japanese.png"]} alt="Japanese" className="vowelchart"/>
            <div className="chart_title"><b>Japanese</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="kabardian">
            <img src={cache["./kabardian.png"]} alt="Kabardian" className="vowelchart"/>
            <div className="chart_title"><b>Kabardian</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="kagayanen">
            <img src={cache["./kagayanen.png"]} alt="Kagayanen" className="vowelchart"/>
            <div className="chart_title"><b>Kagayanen</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="kazakh">
            <img src={cache["./kazakh.png"]} alt="Kazakh" className="vowelchart"/>
            <div className="chart_title"><b>Kazakh</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="korean">
            <img src={cache["./korean.png"]} alt="Korean" className="vowelchart"/>
            <div className="chart_title"><b>Korean</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="luo">
            <img src={cache["./luo.png"]} alt="Luo" className="vowelchart"/>
            <div className="chart_title"><b>Luo</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="maasai">
            <img src={cache["./maasai.png"]} alt="Maasai" className="vowelchart"/>
            <div className="chart_title"><b>Maasai</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="mixtec">
            <img src={cache["./mixtec.png"]} alt="Yoloxóchitl Mixtec" className="vowelchart"/>
            <div className="chart_title"><b>Yoloxóchitl Mixtec</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="creek">
            <img src={cache["./muskogee_creek.png"]} alt="Muskogee Creek" className="vowelchart"/>
            <div className="chart_title"><b>Muskogee Creek</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="nahuatl">
            <img src={cache["./nahuatl.png"]} alt="Nahuatl" className="vowelchart"/>
            <div className="chart_title"><b>Nahuatl</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="nambo">
            <img src={cache["./nambo.png"]} alt="Nambo" className="vowelchart"/>
            <div className="chart_title"><b>Nambo</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="portuguese_br">
            <img src={cache["./portuguese_br.png"]} alt="Portuguese (Brazil)" className="vowelchart"/>
            <div className="chart_title"><b>Portuguese (Brazil)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="portuguese_eu">
            <img src={cache["./portuguese_eu.png"]} alt="Portuguese (Portugal)" className="vowelchart"/>
            <div className="chart_title"><b>Portuguese (Portugal)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="qiang_hongyan">
            <img src={cache["./qiang_hongyan.png"]} alt="Qiang (Hongyan)" className="vowelchart"/>
            <div className="chart_title"><b>Qiang (Hongyan)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="russian_consonants">
            <img src={cache["./russian_consonants.png"]} alt="Russian (Consonants)" className="vowelchart"/>
            <div className="chart_title"><b>Russian (Consonants)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="russian">
            <img src={cache["./russian.png"]} alt="Russian (Vowels)" className="vowelchart"/>
            <div className="chart_title"><b>Russian (Vowels)</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="spanish">
            <img src={cache["./spanish.png"]} alt="Spanish" className="vowelchart"/>
            <div className="chart_title"><b>Spanish</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="tanana_athabaskan">
            <img src={cache["./tanana_athabaskan.png"]} alt="Tanana Athabaskan" className="vowelchart"/>
            <div className="chart_title"><b>Tanana Athabaskan</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="thai">
            <img src={cache["./thai.png"]} alt="Thai" className="vowelchart"/>
            <div className="chart_title"><b>Thai</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="vietnamese">
            <img src={cache["./vietnamese.png"]} alt="Vietnamese" className="vowelchart"/>
            <div className="chart_title"><b>Vietnamese</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
          <Element className="tile" name="welsh">
            <img src={cache["./welsh.png"]} alt="Welsh" className="vowelchart"/>
            <div className="chart_title"><b>Welsh</b></div>
            <div className="chart_info">
              example example example
            </div>
          </Element>
        </div>
        <div id="copy">
          <p>&copy; 2020 David Byron</p>
        </div>
      </section>
    )
  }
}

export default Vowels;
