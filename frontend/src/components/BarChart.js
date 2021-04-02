import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js';
import { useParams } from 'react-router';
import { host, graphcolor, bgcolor, lightgray, gridcolor } from '../constants';
import Spinner from 'react-bootstrap/Spinner';

const layout = {
  height: 500,
  paper_bgcolor: bgcolor,
  plot_bgcolor: bgcolor,
  xaxis: {
    showline: true,
    showgrid: false,
    showticklabels: true,
    tickcolor: lightgray,
    tickfont: {
      color: '#fff'
    },
    linecolor: lightgray,
    linewidth: 2,
  },
  yaxis: {
    tickfont: {
      color: '#fff'
    },
    showgrid: true,
    gridcolor: gridcolor,
    tickmode: 'array',
    showline: false,
    showticklabels: true,

  },
};

function BarChart({ start, end }) {
  const { userId } = useParams();
  const { contentId } = useParams();
  const [barData, setBarData] = useState(null);

  useEffect(() => {
    async function getBarData() {
      console.log(userId, start, end);
      let res;
      if(window.location.pathname.includes('/user_board')){
        res = await fetch(`http://${host}/api/user_board/metrics/quality_histogram?start=${start.toISOString()}&end=${end.toISOString()}&user_id=${userId}`);
      } else {
        res = await fetch(`http://${host}/api/content_board/metrics/quality_histogram?start=${start.toISOString()}&end=${end.toISOString()}&content_id=${contentId}`);
      }

      const barData = await res.json();
      console.log('barData', barData);
      setBarData(barData);
    }

    getBarData();
  }, [userId, start, end, contentId]);

  useEffect(() => {
    if (!barData) return;

    const qs = [240, 360, 480, 720, 1080];
    const data = [
      {
        x: qs.map(x => `${x}p`),
        y: qs.map(x => (barData.find(y => y[0] === x) || [0])[1]),
        type: 'bar',
        marker: { color: graphcolor }
      }
    ];
    Plotly.newPlot('bar', data, layout);
  }, [barData]);

  if (!barData) {
    return (
      <div className="mt-5 mb-5">
        <Spinner animation="border" role="status" variant="secondary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>);
  }

  return (
    <>
      <div id="bar"/>
    </>
  );
}

export default BarChart;
