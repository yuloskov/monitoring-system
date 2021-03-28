import React, { useEffect, useRef, useState } from 'react';
import { withYMaps, YMaps, Map, Clusterer, Placemark, Circle, ObjectManager } from 'react-yandex-maps';

const mapContainer = {
  width: 1000,
  height: 1000
}

class Point {
  constructor(coordinates, color) {
    this.coordinates = coordinates
    this.color = color
  }
}

const points = [
  new Point([50,31], 100),
  new Point([54,34], 100),
  new Point([52,37], 100),
  new Point([56,38], 100),
  new Point([55,37], 0),
]

const geoCounter = function (data, properties, filterValue) {
  return properties._data.geoObjects.length
}

const geoAvgColor = function (data, properties, filterValue) {
  const objects = properties._data.geoObjects
  const sum = objects.reduce((acc, go) => acc + go.properties._data.color, 0)
  const avg = (sum / objects.length) || 0
  return avg
}

export default function() {
  const [points, setPoints] = useState(null)

  useEffect(() => {
    async function foo() {
      const res = await fetch('http://localhost:5000/zhopa')
      const data = (await res.json()).slice(0, 1000)
      const avg = data.map(x => x[0]).reduce((x, y) => x + y, 0) / 1000
      const transform = x => {
        const v = 50 + 50 * (avg - x) / avg
        if (v < 0) return 0
        if (v > 100) return 100
        return v
      }

      setPoints(data.map(([met, lon, lat]) => new Point([lat, lon], transform(met))))
    }
    foo()

  }, [])

  const ColorClusterer = React.useMemo(() => {
    return ({ ymaps }) => {
      ymaps.template.filtersStorage.add('count', geoCounter)
      ymaps.template.filtersStorage.add('avgcolor', geoAvgColor)
      const ClusterIconLayout = ymaps.templateLayoutFactory.createClass(`
        <ymaps class="ymaps-2-1-78-svg-icon" style="
          position: absolute; width: 46px; height: 46px; left: -23px; top: -23px;"
        >
          <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="46"
            height="46"
            viewBox="0,0,400,400"
          >
            <g id="svgg">
              <path
                id="path0"
                d="M154.974 36.553 C 58.106 60.796,3.357 181.668,47.942 272.854 C 114.809 409.613,315.361 395.236,360.422 250.455 C 399.571 124.668,283.939 4.278,154.974 36.553 M247.995 54.789 C 386.714 101.520,386.714 298.480,247.995 345.211 C 149.577 378.366,47.273 304.354,47.273 200.000 C 47.273 95.824,149.745 21.691,247.995 54.789 M169.600 111.389 C 144.718 119.031,118.774 145.560,111.183 171.122 C 82.961 266.153,195.959 335.297,265.628 265.628 C 335.753 195.502,265.120 82.051,169.600 111.389"
                stroke="none"
                fill="hsl({{properties|avgcolor}},100%,50%)"
                fill-rule="evenodd"
              />
            </g>
          </svg>
          <ymaps
            class="ymaps-2-1-78-svg-icon-content"
            style="font: 13px Arial, sans-serif; position: absolute; text-align: center; left: 0px;top: 16px;width: 46px;height: 16px;"
          >
            <ymaps>
              <ymaps class="ymaps-2-1-78-cluster-night-content">
                {{ properties|count }}
              </ymaps>
            </ymaps>
          </ymaps>
        </ymaps>`
      )
      return (
        <Clusterer
          options={{
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterIconLayout: ClusterIconLayout,
            clusterIconShape: {
              type: 'Circle',
              coordinates: [0, 0],
              radius: 23
            }
          }}
        >
        {points.map((p, index) => (
          <Placemark
          key={index}
          geometry={p.coordinates}
          properties={{color: p.color}} />
        ))}
        </Clusterer>
      )
    }
  }, [points])

  const ConnectedColorClusterer = React.useMemo(() => {
    return withYMaps(ColorClusterer, true, ['templateLayoutFactory', 'template.filtersStorage'])
  }, [ColorClusterer])

  if (!points)
    return <h1>ZHOPA</h1>
  return (
    <div style={mapContainer}>
      <YMaps>
        <Map
          defaultState={{
            center: [50, 50],
            zoom: 4,
          }}
          width={900}
          height={400}
        >
          <ConnectedColorClusterer></ConnectedColorClusterer>
        </Map>
      </YMaps>
    </div>
  )
}