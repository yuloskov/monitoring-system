import { OPTION_BUFF, OPTION_QUALITY, YmapsModules, host } from '../constants';
import React, {useEffect, useState} from 'react';
import {withYMaps, YMaps, Map} from 'react-yandex-maps';
import Spinner from 'react-bootstrap/Spinner';

const cache = {};

function geoCounter(data, properties) {
  return properties._data.geoObjects.reduce((acc, go) => acc + go.properties._data.count, 0)
}

function geoAvgColor(data, properties) {
  const objects = properties._data.geoObjects
  const metric = objects.reduce((acc, go) => {
    const data = go.properties._data;
    return acc + data.color * data.count;
  }, 0);
  const count = objects.reduce((acc, go) => {
    return acc + go.properties._data.count;
  }, 0);
  const avg = metric / count || 0;
  return avg;
};

function circleSize(data, properties, arg) {
  if (typeof arg === 'undefined') {
    const count = properties._data.geoObjects.reduce((acc, go) => acc + go.properties._data.count, 0)
    const size = Math.min(50 + Math.round(count/90), 100)
    cache.circleSize = size
    return size
  } else {
    return cache.circleSize
  }
};

function PointsMap({start, end, option}) {
  const [map, setMap] = useState(null)
  const [points, setPoints] = useState(null);
  const [updating, setUpdating] = useState(true);

  async function withUpdating(f) {
    setUpdating(true);
    await f()
    setUpdating(false);
  }

  async function getBuff() {
    const res = await fetch(`http://${host}/api/map/metrics/buff?start=${start.toISOString()}&end=${end.toISOString()}`)
    const data = await res.json();
    const avg = data.reduce((acc, p) => acc + p[0] * p[3], 0) / data.reduce((acc, p) => acc + p[3], 0);
    const transform = x => {
      const v = 50 + 50 * (avg - x) / avg;
      if (v < 0) return 0;
      if (v > 100) return 100;
      return v;
    };

    setPoints(data.map(([met, lon, lat, count]) => [[lat, lon], transform(met), count]));
  }

  async function getQuality() {
    const res = await fetch(`http://${host}/api/map/metrics/quality?start=${start.toISOString()}&end=${end.toISOString()}`)
    const data = await res.json();
    setPoints(data.map(([q, lon, lat, count]) => [[lat, lon], q, count]))
  }

  useEffect(() => {
    if (option === OPTION_BUFF) withUpdating(getBuff);
    else if (option === OPTION_QUALITY) withUpdating(getQuality);
  }, [start, end, option]);

  const ColorClusterer = React.useMemo(() => {
    return ({ymaps}) => {
      if (!map) return '';

      function getClusterIconLayout(option) {
        if (option === OPTION_BUFF) {
          ymaps.template.filtersStorage.add('count', geoCounter);
          ymaps.template.filtersStorage.add('avgcolor', geoAvgColor);
          ymaps.template.filtersStorage.add('circlesize', circleSize);
          return ymaps.templateLayoutFactory.createClass(`
            <ymaps class="ymaps-2-1-78-svg-icon">
              <ymaps
                class="ymaps-2-1-78-svg-icon-content"
                style="font: 13px Arial, sans-serif; position: absolute;"
              >
                <section style="margin-top: -50%; margin-left: -50%; width: {{ properties|circlesize }}px;">
                  <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="100%"
                    viewBox="0,0,400,400"
                    style="position: absolute;"
                  >
                    <g id="svgg">
                      <path
                        id="path0"
                        d="M154.974 36.553 C 58.106 60.796,3.357 181.668,47.942 272.854 C 114.809 409.613,315.361 395.236,360.422 250.455 C 399.571 124.668,283.939 4.278,154.974 36.553 M247.995 54.789 C 386.714 101.520,386.714 298.480,247.995 345.211 C 149.577 378.366,47.273 304.354,47.273 200.000 C 47.273 95.824,149.745 21.691,247.995 54.789 M169.600 111.389 C 144.718 119.031,118.774 145.560,111.183 171.122 C 82.961 266.153,195.959 335.297,265.628 265.628 C 335.753 195.502,265.120 82.051,169.600 111.389"
                        stroke="none"
                        fill="hsl({{ properties|avgcolor }},100%,50%)"
                        fill-rule="evenodd"
                      />
                    </g>
                  </svg>
                  <p style="text-align: center; vertical-align: middle; line-height: {{ properties|circlesize: 'cache' }}px; position: relative; z-index: 228">
                    {{ properties|count }}
                  </p>
                </section>
              </ymaps>
            </ymaps>`
          )
        }
        else if (option === OPTION_QUALITY) return 'default#pieChart'
      }

      function qualityToColor(q) {
        if (q === 1080) return '#00FF00'
        else if (q === 720) return '#FFFF00'
        else return '#FF0000'
      }
      function createPlacemark(p, option) {
        let placemark
        if (option === OPTION_BUFF) placemark = new ymaps.Placemark(p[0], {color: p[1], count: p[2]})
        else placemark = new ymaps.Placemark(p[0],
          {},
          {
            iconColor: qualityToColor(p[1]),
            weight: p[2],
          }
        )
        return placemark
      }

      const clusterer = new ymaps.Clusterer({
        clusterIconLayout: getClusterIconLayout(option),
        clusterIconShape: {
          type: 'Circle',
          coordinates: [0, 0],
          radius: 23
        },
        minClusterSize: 1
      });
      if (option === OPTION_QUALITY) {
        clusterer.createCluster = function (center, geoObjects) {
          const clusterPlacemark = ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects)
          clusterPlacemark.properties.set({
            data: geoObjects.map(o => {return {weight: o.options._options.weight, color: o.options._options.iconColor}})
          });
          clusterPlacemark.options.set('iconLayout', 'default#pieChart');
          return clusterPlacemark
        }
      }
      map.geoObjects.removeAll();
      clusterer.add(points.map(p => createPlacemark(p, option)));
      map.geoObjects.add(clusterer);
      const zoomControl = new ymaps.control.ZoomControl({
        options: {
          size: 'small'
        }
      });
      map.controls.add(zoomControl);

      return '';
    };
  }, [points, map]);

  const ConnectedColorClusterer = React.useMemo(() => {
    return withYMaps(ColorClusterer, true, YmapsModules);
  }, [ColorClusterer]);

  if (!points || updating) {
    return (
      <div className="mt-5 mb-5">
        <Spinner animation="border" role="status" variant="secondary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <YMaps>
      <Map
        style={{position: 'absolute', width: '100%', height: '100%'}}
        defaultState={{
          center: [50, 50],
          zoom: 4,
        }}
        options={{
          maxZoom: 10,
          minZoom: 4
        }}
        instanceRef={(map) => setMap(map)}
      >
        <ConnectedColorClusterer/>
      </Map>
    </YMaps>
  );
}

export default PointsMap;
