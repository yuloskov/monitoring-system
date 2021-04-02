import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js';
import { useParams } from 'react-router';
import Spinner from 'react-bootstrap/Spinner';
import { host, graphcolor, bgcolor, lightgray, gridcolor } from '../constants';

const layout = {
  height: 500,
  bargap: 0.1,
  paper_bgcolor: bgcolor,
  plot_bgcolor: bgcolor,
  xaxis: {
    title: 'Buffering duration (msec)',
    showline: true,
    showgrid: false,
    showticklabels: true,
    titlefont: {
      color: lightgray
    },
    tickcolor: lightgray,
    tickfont: {
      color: '#fff'
    },
    linecolor: lightgray,
    linewidth: 2,
  },
  yaxis: {
    title: 'count',
    titlefont: {
      color: lightgray
    },
    tickfont: {
      color: '#fff'
    },
    showgrid: true,
    gridcolor: gridcolor,
    tickmode: 'array',
    showticklabels: true,                                           
  }
};

function BufferingPlot({ start, end }) {
  const { userId } = useParams();
  const { contentId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getBuffChartDataData() {
      let res;
      if(window.location.pathname.includes('/user_board')){
        res = await fetch(`http://${host}/api/user_board/metrics/buff?user_id=${userId}&start=${start.toISOString()}&end=${end.toISOString()}`);
      } else {
        res = await fetch(`http://${host}/api/content_board/metrics/buff?content_id=${contentId}&start=${start.toISOString()}&end=${end.toISOString()}`);
      }
      const json = await res.json();
      console.log(json)
      const data = [{
        x: json,
        type: 'histogram',
        marker: {
          color: graphcolor
        }
      }];
      setData(data);
    }

    getBuffChartDataData();

  }, [userId, start, end, contentId]);

  useEffect(() => {
    if (!data) return;

    Plotly.newPlot('buff', data, layout);
  });

  if (!data) {
    return (
      <div className="mt-5 mb-5">
        <Spinner animation="border" role="status" variant="secondary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <div id="buff" />
    </>
  );
}

export default BufferingPlot;
