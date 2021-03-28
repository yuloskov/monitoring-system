import React, {useEffect} from 'react';
import Plotly from 'plotly.js-basic-dist';

function ScatterPlot() {
  useEffect(() => {
    const data = [
      {
        x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
        y: [1, 3, 6],
        type: 'scatter'
      }
    ];

    Plotly.newPlot('scatter', data, {height: 500});
  });


  return (
    <>
      <div id="scatter">Scatter</div>
    </>
  );
}

export default ScatterPlot;
