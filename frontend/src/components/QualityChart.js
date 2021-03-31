import React, {useEffect} from 'react';
import Plotly from 'plotly.js-basic-dist';

function QualityChart({start, end}) {

  const qualityChartData = [
    {
      x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
      y: [480, 480, 720],
      type: 'scatter'
    }
  ];

  useEffect(() => {
    Plotly.newPlot('quality', qualityChartData, {height: 500});
  }, [qualityChartData]);

  return (
    <>
      <div id="quality">Quality changes timeline</div>
    </>
  );
}

export default QualityChart;
