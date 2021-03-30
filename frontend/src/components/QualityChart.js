import React, {useEffect} from 'react';
import Plotly from 'plotly.js-basic-dist';

function QualityChart({data}) {
  useEffect(() => {
    async function getData(){
        const profile_id = '1b82426f636f34fea6603502d1fca9e6'
        const start = new Date('2021-03-08T19:00:00').toISOString()
        const end = new Date('2021-03-08T20:00:00').toISOString()
        const res = await fetch(`http://localhost:5000/api/board/qualitychart?profile_id=${profile_id}&start=${start}&end=${end}`,);
        const data = await res.json();
        Plotly.newPlot('quality', data, {height: 500});

      }
      getData()
  });
  

  return (
    <>
      <div id="quality">Quality changes timeline</div>
    </>
  );
}

export default QualityChart;
