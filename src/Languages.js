import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, Cell } from 'recharts';
import './Languages.css';

const levelFormatter = (value) => {
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

// The following is adapted from: https://recharts.org/en-US/examples/CustomizedLabelLineChart
class CustomizedAxisTick extends React.Component {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={5} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
      </g>
    );
  }
}

function Languages(props) {
  const [focusBar, setFocusBar] = useState(null);

  const data = [
    { name: 'Arabic (MSA, Palestinian)', alt: 'Arabic', level: 3 },
    { name: 'Arpitan (Cuenco)', alt: 'Arpitan', level: 2 },
    { name: 'English (US)', alt: 'English', level: 5},
    { name: 'French (Swiss)', alt: 'French', level: 5},
    { name: 'German', alt: 'German', level: 4 },
    { name: 'Indonesian (Jakarta)', alt: 'Indonesian', level: 1 },
    { name: 'isiXhosa', alt: 'isiXhosa', level: 3},
    { name: 'Khoekhoe', alt: 'Khoekhoe', level: 1 },
    { name: 'Limba', alt: 'Limba', level: 1 },
    { name: 'Senslerdeutsch', alt: 'Senslerdeutsch', level: 2 },
    { name: 'Setswana', alt: 'Setswana', level: 1 },
    { name: 'Singlish', alt: 'Singlish', level: 1 },
    { name: 'Spanish', alt: 'Spanish', level: 2 },
    { name: 'Tshivenda', alt: 'Tshivenda', level: 1 }
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
            margin={{ bottom: 85 }}
            onMouseMove={state => {
              if (state.isTooltipActive) {
                setFocusBar(state.activeTooltipIndex);
              } else {
                setFocusBar(null);
              }
            }}>
            <Tooltip formatter={(value, name, props) => { return levelFormatter(value) }} />
            <XAxis
              type="category"
              dataKey="name"
              interval={0}
              tick={<CustomizedAxisTick />}
              tickLine={false}
              />
            <YAxis
              type="number"
              dataKey="level"
              domain={[0,5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={levelFormatter}
              width={150} />
            <Bar
              dataKey="level"
              isAnimationActive={false}>
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
