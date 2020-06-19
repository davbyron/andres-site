import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, Cell } from 'recharts';
import './Languages.css';

const formatter = (value) => {
  switch(value) {
    case 1:
      return 'Fieldwork';
      break;
    case 2:
      return 'Conversational';
      break;
    case 3:
      return 'Proficient';
      break;
    case 4:
      return 'Fluent';
      break;
    case 5:
      return 'Native';
      break;
    default:
      return 'null';
      break;
  }
}

const whichColor = (value) => {
  switch (value) {
    case 1:
      return '#713E5A';
      break;
    case 2:
      return '#63A375';
      break;
    case 3:
      return '#EDC79B';
      break;
    case 4:
      return '#D57A66';
      break;
    case 5:
      return '#CA6680';
      break;
    default:
      return 'null';
      break;
  }
}

function Languages(props) {
  const [focusBar, setFocusBar] = useState(null);

  const data = [
    { name: 'Arabic (MSA, Palestinian)', alt: 'AR', level: 3 },
    { name: 'Arpitan (Cuenco)', alt: 'FRP', level: 2 },
    { name: 'English (US)', alt: 'EN', level: 5},
    { name: 'French (Swiss)', alt: 'FR', level: 5},
    { name: 'German', alt: 'GER', level: 4 },
    { name: 'Indonesian (Jakarta)', alt: 'IND', level: 1 },
    { name: 'isiXhosa', alt: 'XH', level: 3},
    { name: 'Khoekhoe', alt: 'KH', level: 1 },
    { name: 'Limba', alt: 'LIA', level: 1 },
    { name: 'Senslerdeutsch', alt: 'GSW', level: 2 },
    { name: 'Setswana', alt: 'TN', level: 1 },
    { name: 'Singlish', alt: 'SIN', level: 1 },
    { name: 'Spanish', alt: 'ES', level: 2 }
  ];

  return (
    <section className="languages">
      <div className="title">languages</div>
      <div className="chart">
        <ResponsiveContainer
          width="100%"
          height="70%">
          <BarChart
            data={data}
            onMouseMove={state => {
              if (state.isTooltipActive) {
                setFocusBar(state.activeTooltipIndex);
              } else {
                setFocusBar(null);
              }
            }}>
            <Tooltip formatter={(value, name, props) => { return formatter(value) }}/>
            <XAxis
              dataKey="name"
              tick={false}
              tickLine={false}/>
            <YAxis
              type="number"
              dataKey="level"
              domain={[0,5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={formatter}
              width={150} />
            <Bar
              dataKey="level"
              isAnimationActive={false}>
              <LabelList
                dataKey="alt"
                position="bottom"/>
              {data.map((entry, index) => (
                <Cell fill={whichColor(entry['level'])} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default Languages;
