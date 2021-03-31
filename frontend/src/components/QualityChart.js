import React, {useEffect, useState} from 'react';
import Plotly from 'plotly.js-basic-dist';
import {useParams} from 'react-router';
import {host} from '../constants';
import Spinner from 'react-bootstrap/Spinner';

function QualityChart({start, end}) {
  const {userId} = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getQualityChartData() {
      const res = await fetch(`http://${host}/api/user_board/metrics/quality_chart?profile_id=${userId}&start=${start.toISOString()}&end=${end.toISOString()}`);
      setData(await res.json());
    }

    getQualityChartData();
  }, [userId, start, end]);

  useEffect(() => {
    if (!data) return;

    Plotly.newPlot('quality', data, {height: 500});
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
