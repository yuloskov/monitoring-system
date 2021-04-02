import React, {useEffect, useState} from 'react';
import Plotly from 'plotly.js';
import { useParams } from 'react-router';
import { host, graphcolor, bgcolor, lightgray, gridcolor, tickformatstops} from '../constants';
import Spinner from 'react-bootstrap/Spinner';

const layout = {
  height: 500,
  paper_bgcolor: bgcolor,
  plot_bgcolor: bgcolor,
  xaxis: {
    title: 'timestamps',
    showline: true,
    showgrid: false,
    showticklabels: true,
    titlefont:{
      color: lightgray
    },
    tickcolor: lightgray,
    tickfont:{
      color: '#fff'
    },
    linecolor: lightgray,
    linewidth: 2,
    tickformatstops: tickformatstops,
  },
  yaxis: {
    title: 'views',
    titlefont:{
      color: lightgray
    },
    tickfont:{
      color: '#fff'
    },
    showgrid: true,
    gridcolor: gridcolor,
    // tickmode: 'array',
    showticklabels: true,
  },
};

function ContentViewsChart({start, end}) {
  const {contentId} = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    async function getQualityChartData() {
      const res = await fetch(`${host}/api/content_board/metrics/views_chart?content_id=${contentId}&start=${start.toISOString()}&end=${end.toISOString()}`);
      const json = await res.json();

      const data = [{
        x: json.map(x => x[1]).map((str) => new Date(str).toISOString()),
        y: json.map(x => x[0]),
        line: {
          width: 3,
          color: graphcolor
        },
        type: 'scatter'
      }]

      setData(data);
    }

    getQualityChartData();
  }, [contentId, start, end]);

  useEffect(() => {
    if (!data) return;
    Plotly.newPlot('views', data, layout);
  }, [data]);

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
      <div id="views"/>
    </>
  );
}

export default ContentViewsChart;
