import React, {useEffect, useState} from 'react';
import Plotly from 'plotly.js-basic-dist';
import {useParams} from 'react-router';
import {host, tickformatstops} from '../constants';
import Spinner from 'react-bootstrap/Spinner';

function QualityChart({start, end}) {
  const {userId} = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getQualityChartData() {
      const res = await fetch(`http://${host}/api/user_board/metrics/quality_chart?profile_id=${userId}&start=${start.toISOString()}&end=${end.toISOString()}`);
      const json = await res.json();
      const data = [{
        ...json,
        'line': {'shape': 'vh'},
        'type': 'scatter'
      }];
      data[0].x = data[0].x.map((str) => {
        str = new Date(str).toISOString();
        return str;
      });
      setData(data);
    }

    getQualityChartData();
  }, [userId, start, end]);

  useEffect(() => {
    if (!data) return;
    const layout = {
      height: 500,
      xaxis: {
        title: 'timestamps',
        showline: true,
        showgrid: false,
        showticklabels: true,
        linecolor: 'rgb(204,204,204)',
        linewidth: 2,
        tickformatstops: tickformatstops,
      },
      yaxis: {
        title: 'video quality',
        tickmode: 'array',
        tickvals: [240, 360, 480, 540, 720, 1080, 1440, 2160]
      },
    };
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
      <div id="quality">Quality changes timeline</div>
    </>
  );
}

export default QualityChart;
