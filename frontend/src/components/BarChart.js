import React, {useEffect, useState} from 'react';
import Plotly from 'plotly.js-basic-dist';
import { useParams } from 'react-router';

function BarChart({start, end}) {
  const { userId } = useParams()
  const [barData, setBarData] = useState(null)

  useEffect(() => {
    async function getBarData() {
      console.log(userId, start, end);
      const res = await fetch(`http://localhost:5000/api/user_board/metrics/quality_histogram?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      
      const barData = await res.json();
      console.log('barData', barData);
      setBarData(barData);
    }

    getBarData()
  }, [userId, start, end])

  useEffect(() => {
    if (!barData) return

    const qs = [240, 360, 480, 720, 1080]
    const data = [
      {
        x: qs.map(x => `${x}p`),
        y: qs.map(x => (barData.find(y => y[0] === x) || [0])[1]),
        type: 'bar'
      }
    ];

    Plotly.newPlot('bar', data, {height: 500});
  }, [barData]);

  if (!barData) {
    return <h1>Loading</h1>
  }

  return (
    <>
      <div id="bar">Giraffes</div>
    </>
  );
}

export default BarChart;
