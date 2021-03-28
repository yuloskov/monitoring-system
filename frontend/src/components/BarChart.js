import React, {useEffect} from 'react';
import Plotly from 'plotly.js-basic-dist';

function BarChart() {
  useEffect(() => {
    const data = [
      {
        x: ['giraffes', 'orangutans', 'monkeys'],
        y: [20, 14, 23],
        type: 'bar'
      }
    ];

    Plotly.newPlot('bar', data, {height: 500});
  });


  return (
    <>
      <div id="bar">Giraffes</div>
    </>
  );
}

export default BarChart;
