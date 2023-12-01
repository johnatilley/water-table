import { useRef, useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_API_KEY;

const MapBox = ({
  mapData
}) => {

  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  const colorScales = {
    "temperature": [
      0, '#f6f6f6',
      10, '#1cdce8',
      15, '#bb77ed',
      20, '#f71e06'],
    "oxygen": [
      19, '#f6f6f6',
      30, '#f71e06'
    ],
    "battery": [
      20, '#f71e06',
      40, "#f6f6f6",
      60, '#46e83d'
    ],
    "height": [
      9, '#1c3e35',
      12, '#99f2d1'
    ],
    "speed": [
      8, '#f2e713',
      12, '#f71e06'
    ]
  };

  // const colorScales = {
  //   "temperature": [0, '#607ba6', 3, '#415c87', 6, '#26436f', 9, '#27678a',
  //     12, '#648d89', 15, '#c2ab75', 18, '#be704c', 21, '#87203e'],
  //   "oxygen": [0, '#607ba6', 3, '#415c87', 6, '#26436f', 9, '#27678a',
  //     12, '#648d89', 15, '#c2ab75', 18, '#be704c', 21, '#87203e'],
  //   "battery": [20, '#ff0000', 40, "#CCCCCC", 60, '#00FF00'],
  //   "height": [0, '#607ba6', 3, '#415c87', 6, '#26436f', 9, '#27678a',
  //     12, '#648d89', 15, '#c2ab75', 18, '#be704c', 21, '#87203e'],
  //   "speed": [0, '#607ba6', 3, '#415c87', 6, '#26436f', 9, '#27678a',
  //     12, '#648d89', 15, '#c2ab75', 18, '#be704c', 21, '#87203e']
  // };


  useEffect(() => {
    const { geoJsonData, center, display, month } = mapData;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 14
    });

    map.on('load', () => {
      map.addSource('sensors', {
        type: 'geojson',
        data: geoJsonData
      });

      map.addLayer({
        'id': 'sensors-circles',
        'type': 'circle',
        'source': 'sensors',
        'filter': ['==', "month", month],
        'paint': {
          'circle-blur': 0.2,
          'circle-radius': 40,
          'circle-opacity': 1,
          'circle-color': [
            'interpolate',
            ['exponential', 1],
            ['get', display],
            ...colorScales[display]
          ]
        }
      });

      map.addLayer({
        'id': 'sensors-labels',
        'type': 'symbol',
        'source': 'sensors',
        'filter': ['==', "month", month],
        'layout': {
          'text-field': ['concat', ['to-string', ['get', display]], ['to-string', ['get', display + "_unit"]]],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        'paint': {
          'text-color': 'rgba(255,255,255,1)',
          'text-halo-blur': 1,
          'text-halo-width': 1,
          'text-halo-color': 'rgba(0,0,0,0.5)'
        }
      });

      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    const { geoJsonData, center, display, month } = mapData;

    if (map !== null) {

      map.setFilter('sensors-circles', ['==', "month", month]);
      map.setFilter('sensors-labels', ['==', "month", month]);

      map.setCenter(center);
      map.getSource("sensors").setData(geoJsonData);

      // I've put timeouts on these to make them a little be asynchronous becuase they seem
      // to lag when you update them at the same time and end up displaying incorrect data
      setTimeout(() => {
        map.setLayoutProperty('sensors-labels', 'text-field',
          ['concat', ['to-string', ['get', display]], ['to-string', ['get', display + "_unit"]]]
        );
      }, 10);
      setTimeout(() => {
        map.setPaintProperty('sensors-circles', 'circle-color',
          ['interpolate', ['exponential', 1], ['get', display], ...colorScales[display]]
        );
      }, 20);
    }
  }, [mapData]);

  const keyGradient = colorScales[mapData.display].filter((color, index) => index % 2 !== 0).map(
    (color, index) => color + " " + (index / (((colorScales[mapData.display].length) / 2) - 1) * 100
    ) + '%').join(', ');

  console.log(keyGradient);

  return (
    <div className='relative'>
      <div className='absolute top-4 left-4 z-10 p-2 bg-white rounded-md shadow-md flex justify-start items-center gap-2'>
        <p className='capitalize'>{mapData.display}</p>
        <div className="w-24 lg:w-48 h-4 rounded-md"
          style={{ background: `linear-gradient(90deg, ${keyGradient})` }}></div>
      </div>
      <div ref={mapContainer} className="map-container h-[50vh]" />
    </div>
  );
};

export default MapBox;