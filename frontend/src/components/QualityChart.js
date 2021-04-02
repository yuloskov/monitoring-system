import React, {useEffect, useState} from 'react';
import Plotly from 'plotly.js';
import { useParams } from 'react-router';
import { host, graphcolor, bgcolor, lightgray, gridcolor, tickformatstops} from '../constants';
import Spinner from 'react-bootstrap/Spinner';


function QualityChart({start, end}) {
  const {userId} = useParams();
  const [data, setData] = useState(null);
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
      title: 'video quality',
      type: 'category',
      categoryorder: 'array',
      categoryarray: [240, 360, 480, 720, 1080],
      tickvals: [240, 360, 480, 720, 1080],
      ticktext: ['240p', '360p', '480p', '720p', '1080p'],
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
  useEffect(() => {
    async function getQualityChartData() {
      const res = await fetch(`http://${host}/api/user_board/metrics/quality_chart?profile_id=${userId}&start=${start.toISOString()}&end=${end.toISOString()}`);
      const json = await res.json();

      const data = [{
        x: json.map(x => x[1]).map((str) => new Date(str).toISOString()),
        y: json.map(x => x[0]),
        line: {
          shape: 'hvh',
          width: 3,
          color: graphcolor
        },
        type: 'scatter'
      }]

      setData(data);
    }

    getQualityChartData();
  }, [userId, start, end]);

  useEffect(() => {
    if (!data) return;
    Plotly.newPlot('quality', data, layout);
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
      <div id="quality"/>
    </>
  );
}

export default QualityChart;
