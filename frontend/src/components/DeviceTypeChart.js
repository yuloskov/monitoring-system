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

function DeviceTypeChart({ start, end }) {
  const { contentId } = useParams();
  const [barData, setBarData] = useState(null);

  useEffect(() => {
    async function getBarData() {
      
      const res = await fetch(`${host}/api/content_board/metrics/device_types?start=${start.toISOString()}&end=${end.toISOString()}&content_id=${contentId}`);

      const barData = await res.json();
      console.log('barData', barData);
      setBarData(barData);
    }

    getBarData();
  }, [contentId, start, end, contentId]);

  useEffect(() => {
    if (!barData) return;

    const devices = ['mobile_web', 'desktop_web', 'tablet_web'];
    const data = [
      {
        x: devices.map(x => `${x.split('_')[0]}`),
        y: devices.map(x => (barData.find(y => y[0] === x) || [0])[1]),
        type: 'bar',
        marker: { color: graphcolor }
      }
    ];
    Plotly.newPlot('devices', data, layout);
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
      <div id="devices"/>
    </>
  );
}

export default DeviceTypeChart;
