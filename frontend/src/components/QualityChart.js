import React, {useEffect} from 'react';
import Plotly from 'plotly.js-basic-dist';

function QualityChart({qualityChartData}) {

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
