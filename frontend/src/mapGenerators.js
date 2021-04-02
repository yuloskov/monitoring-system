import { OPTION_BUFF, OPTION_QUALITY, QUALITY_BAD, QUALITY_COLOR } from './constants';

export class QualityMapGenerator {
  type = OPTION_QUALITY

  constructor() {
    this.colors = [
      ...Object.entries(QUALITY_COLOR).map(([q, c]) => ({
        value: q,
        name: c,
        opacity: 1,
      })).reverse(),
      {
        value: 'Other',
        name: QUALITY_BAD,
        opacity: 1
      },
    ]
  }

  init(ymaps) {
    this.ymaps = ymaps
  }

  legendHtml() {
    return `
      <div class="legend">
        <div class="legend__name">Quality</div>
        ${this.colors.map(color => `
          <div class="legend__row legend__row__center">
            <span class="legend__value">
              ${`${color.value}`}
            </span>
            <span
              class="legend__color legend__sqr"
              style="background: ${color.name}; opacity: ${color.opacity}"
            />
          </div>
        `).join('\n')}
      </div>
    `;
  }

  getClusterIconLayout() {
    return 'default#pieChart'
  }

  createPlacemark(p) {
    return new this.ymaps.Placemark(p[0],
      {},
      {
        iconColor: QUALITY_COLOR[p[1]] || QUALITY_BAD,
        weight: p[2],
      }
    )
  }
}

export class BuffMapGenerator {
  type = OPTION_BUFF

  geoCounter(data, properties) {
    return properties._data.geoObjects.reduce((acc, go) => acc + go.properties._data.count, 0)
  }

  geoAvgColor(data, properties) {
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

  circleSize(cache) {
    return (data, properties, arg) => {
      if (typeof arg === 'undefined') {
        const count = properties._data.geoObjects.reduce((acc, go) => acc + go.properties._data.count, 0)
        const size = Math.min(50 + Math.round(count / 90), 100)
        cache.circleSize = size
        return size
      } else {
        return cache.circleSize
      }
    }
  };


  init(ymaps) {
    this.ymaps = ymaps
    this.ymaps.template.filtersStorage.add('count', this.geoCounter);
    this.ymaps.template.filtersStorage.add('avgcolor', this.geoAvgColor);
    this.ymaps.template.filtersStorage.add('circlesize', this.circleSize({}));
    this.min = null
    this.max = null
  }

  setBuffLimits(min, max) {
    this.min = Math.round(min)
    this.max = Math.round(max)
  }

  genMetrics(n) {
    let scale = ''
    let cur = this.min
    let step = Math.round((this.max - this.min) / n)
    for (let i = 0; i < n; i++) {
      scale += `<span>${cur / 1000} s</span>\n`
      cur += step
    }
    return scale
  }

  legendHtml(min, max) {
    return `
      <div class="legend">
        <div class="legend__name">Buffering time</div>
        <div class="legend__row legend__row__space">
          <span class="legend__value__bar">
            ${this.genMetrics(3)}
          </span>
          <span
            class="legend__color legend__rect"
            style="background: linear-gradient(to bottom, #00FF00, #FF0000)"
          />
        </div>
      </div>
    `;
  }

  getClusterIconLayout() {
    return this.ymaps.templateLayoutFactory.createClass(`
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

  createPlacemark(p) {
    return new this.ymaps.Placemark(p[0], { color: p[1], count: p[2] })
  }
}