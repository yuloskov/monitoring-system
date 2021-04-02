import { OPTION_BUFF, OPTION_QUALITY, YmapsModules, host } from '../constants';
import React, { useEffect, useState } from 'react';
import { withYMaps, YMaps, Map, Clusterer } from 'react-yandex-maps';
import { QualityMapGenerator, BuffMapGenerator } from '../mapGenerators';
import { useParams } from 'react-router';

let maxMet;
let minMet;

function legendGen(ymaps, MapGen) {
  return (map) => {
    const LegendControlClass = function (options) {
      LegendControlClass.superclass.constructor.call(this, options);
    };

    ymaps.util.augment(LegendControlClass, ymaps.collection.Item, {
      onAddToMap(map) {
        LegendControlClass.superclass.onAddToMap.call(this, map);
        this.getParent().getChildElement(this).then(this._onGetChildElement, this);
      },
      _onGetChildElement(parentDomContainer) {
        const legend = document.createElement('div');
        legend.className = 'ymaps-color-legend';
        legend.innerHTML = MapGen.legendHtml()

        parentDomContainer.appendChild(legend);
      }
    });

    map.controls.each(c => {
      map.controls.remove(c)
      return true
    })
    map.controls.add(new LegendControlClass(), {
      float: 'none',
      position: {
        top: 15,
        right: 15
      },
    });
  }
}

export default ({ start, end }) => {
  const {option = OPTION_QUALITY} = useParams()
  const ColorClusterer = React.useMemo(() => {
    return ({ ymaps, MapGen, updateLegend },) => {
      const [points, setPoints] = useState(null);

      useEffect(() => {
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
          maxMet = data[0][0]
          minMet = data[0][0]
          setPoints(data.map(([met, lon, lat, count]) => {
            if (met > maxMet) maxMet = met
            if (met < minMet) minMet = met
            return [[lat, lon], transform(met), count]
          }))
        }

        async function getQuality() {
          const res = await fetch(`http://${host}/api/map/metrics/quality?start=${start.toISOString()}&end=${end.toISOString()}`)
          const data = await res.json();
          setPoints(data.map(([q, lon, lat, count]) => [[lat, lon], q, count]))
        }

        if (MapGen.type === OPTION_BUFF) getBuff();
        else if (MapGen.type === OPTION_QUALITY) getQuality();
      }, [MapGen.type]);

      return (
        <Clusterer instanceRef={(clusterer) => {
          if (!points || !clusterer) return;
          if (MapGen.type === OPTION_BUFF) MapGen.setBuffLimits(minMet, maxMet)
          updateLegend(clusterer.getMap())
          clusterer.options.set('clusterIconLayout', MapGen.getClusterIconLayout())
          clusterer.options.set('clusterIconShape', {
            type: 'Circle',
            coordinates: [0, 0],
            radius: 23
          })
          clusterer.options.set('minClusterSize', 1)


          clusterer.createCluster = function (center, geoObjects) {
            const clusterPlacemark = ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects)
            if (MapGen.type === OPTION_BUFF) return clusterPlacemark
            const clusterData = {}
            geoObjects.forEach(o => {
              const color = o.options._options.iconColor
              const weight = o.options._options.weight
              if (typeof clusterData[color] === 'undefined') clusterData[color] = weight
              else clusterData[color] += weight
            })
            clusterPlacemark.properties.set({
              data: Object.entries(clusterData).map(([color, weight]) => ({ color, weight }))
            });
            const getR = (base, mult) => (data) => base + mult * Math.log(data.reduce((acc, o) => acc + o.weight, 0))
            clusterPlacemark.options.set('iconLayout', 'default#pieChart');
            clusterPlacemark.options.set('iconPieChartRadius', getR(13, 2))
            clusterPlacemark.options.set('iconPieChartCoreRadius', getR(7, 1))
            return clusterPlacemark
          }

          clusterer.removeAll()
          clusterer.add(points.map(p => MapGen.createPlacemark(p)));
        }}>
        </Clusterer>
      )
    }
  }, [end, start])
  const TestClusterer = React.useMemo(() => {
    return withYMaps(ColorClusterer, true, YmapsModules)
  }, [ColorClusterer])

  const ZoomMap = React.useMemo(() => {
    const MapGen = option === OPTION_BUFF ? new BuffMapGenerator() : new QualityMapGenerator()

    return ({ ymaps, children }) => {
      const updateLegend = legendGen(ymaps, MapGen)
      const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { MapGen, updateLegend });
        }
        return child;
      });

      return (
        <Map
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          defaultState={{
            center: [55, 75],
            zoom: 4,
          }}
          options={{
            maxZoom: 10,
            minZoom: 4
          }}
          instanceRef={(newMap) => {
            if (!newMap) return;
            const zoomControl = new ymaps.control.ZoomControl({
              options: {
                size: 'small'
              }
            });
            newMap.controls.add(zoomControl);

            MapGen.init(ymaps)
          }}
        >
          {childrenWithProps}
        </Map>)
    }
  }, [option])

  const ZoomMapEl = React.useMemo(() => {
    return withYMaps(ZoomMap, true, YmapsModules)
  }, [ZoomMap])

  return (
    <YMaps>
      <ZoomMapEl>
        <TestClusterer></TestClusterer>
      </ZoomMapEl>
    </YMaps>
  );
}