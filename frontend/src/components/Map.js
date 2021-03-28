import React, { useRef, useState } from 'react';
import { withYMaps, YMaps, Map, Clusterer, Placemark, Circle, ObjectManager } from 'react-yandex-maps';

const mapContainer = {
  width: 1000,
  height: 1000
}

const points = [[50,31], [54,34], [52,37], [56,38], [55.751574, 37.573856]]

const geoCounter = function (data, properties, filterValue) {
  console.log('filter')
  console.log(data)
  console.log(properties)
  console.log(filterValue)
  return properties._data.geoObjects.length
}

const geoAvgColor = function (data, properties, filterValue) {
  const avg = '#000000'
  for (const go of properties._data.geoObjects) {
    console.log(go.properties._data.color)
  }
  return avg
}

export default function() {
  const ColorClusterer = React.useMemo(() => {
    return ({ ymaps }) => {
      ymaps.template.filtersStorage.add('count', geoCounter)
      ymaps.template.filtersStorage.add('avgcolor', geoAvgColor)
      const ClusterIconLayout = ymaps.templateLayoutFactory.createClass(
        `<ymaps class="ymaps-2-1-78-svg-icon" style="
            background-color: {{ properties|avgcolor }};
            position: absolute; width: 46px; height: 46px; left: -23px; top: -23px;">
          <ymaps class="ymaps-2-1-78-svg-icon-content" style="font: 13px Arial, sans-serif; position: absolute; text-align: center; left: 0px;top: 16px;width: 46px;height: 16px;">
            <ymaps>
              <ymaps class="ymaps-2-1-78-cluster-night-content">
                {{ properties|count }}
              </ymaps>
            </ymaps>
          </ymaps>
        </ymaps>`,
        {
          build: function() {
            ClusterIconLayout.superclass.build.call(this);
          },
        }
      )
      return (
        <Clusterer
          options={{
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterIconLayout: ClusterIconLayout,
            // clusterIconShape: {
            //   type: 'Rectangle',
            //   coordinates: [[0, 0], [20, 20]]
            // }
            fhsjkd: 10
          }}
          instanceRef={(a) => {console.log(a)}}
        >
        {points.map((coordinates, index) => (
          <Placemark
          key={index}
          geometry={coordinates}
          properties={{color: '#000000'}} />
        ))}
        </Clusterer>
      )
    }
  }, [])

  const ConnectedColorClusterer = React.useMemo(() => {
    return withYMaps(ColorClusterer, true, ['templateLayoutFactory', 'template.filtersStorage'])
  }, [ColorClusterer])

  return (
    <div style={mapContainer}>
      <YMaps>
        <Map
          defaultState={{
            center: points[0],
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