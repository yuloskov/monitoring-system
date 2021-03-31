import React, {useEffect, useState} from 'react';
import Plotly from 'plotly.js-basic-dist';
import { useParams } from 'react-router';

function QualityChart({start, end}) {
  const { userId } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    async function getQualityChartData() {
      const res = await fetch(`http://localhost:5000/api/user_board/metrics/quality_chart?profile_id=${userId}&start=${start.toISOString()}&end=${end.toISOString()}`);
      setData(await res.json());
    }

    getQualityChartData()
  }, [userId, start, end])

  useEffect(() => {
    if (!data) return

    Plotly.newPlot('quality', data, {height: 500});
  }, [data]);

  return (
    <>
      <div id="quality">Quality changes timeline</div>
    </>
  );
}

export default QualityChart;
