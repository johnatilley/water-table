import { useContext, useEffect, useState } from "react";
import { startOfMonth, isBefore, addMonths, format } from "date-fns";

// import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import SensorViewerContext from "../SensorViewerContext";
import MapBox from "./MapBox";
import { map, set } from "lodash";

const SensorViewerMap = () => {
  const { filteredSensorData, sensorFilter } = useContext(SensorViewerContext);
  const [mapData, setMapData] = useState({
    dataLoaded: false,
    geoJsonData: null,
    center: null,
    display: "temperature",
    monthRange: [],
    selectedMonth: 0,
    month: null
  });

  /**
   * Whenever the filters change we want to reformat the data to be used by the map
   */
  useEffect(() => {
    if (sensorFilter.sensorId !== "") {
      const formattedSensorData = filteredSensorData
        .sort((a, b) => {
          return new Date(a.transmittedAt.iso) > new Date(b.transmittedAt.iso) ? 1 : -1;
        })
        .map((item) => {
          return { ...item, latlng: item.latitude + "," + item.longitude };
        });

      // Get array of unique locations
      const uniqueLatlngs = [...new Set(formattedSensorData.map(item => item.latlng))];

      // Create an array of months between the from and to dates
      let monthlyData = [];
      let monthCounter = startOfMonth(sensorFilter.transmittedAtFrom);
      while (isBefore(monthCounter, sensorFilter.transmittedAtTo)) {
        monthlyData[format(monthCounter, "yyyy-MM")] = {};
        monthCounter = addMonths(monthCounter, 1);
      }

      const targetDataForAvg = ["battery", "height", "speed", "temperature", "oxygen"];

      // Loop through each month and each location and calculate the average for each target
      for (const month in monthlyData) {
        for (const latlng of uniqueLatlngs) {
          // Filter out formattedSensorData to only include the current month and current location
          const filtered = formattedSensorData.filter((item) => {
            return item.latlng === latlng && format(new Date(item.transmittedAt.iso), "yyyy-MM") === month;
          });

          for (const target of targetDataForAvg) {
            const sum = filtered.reduce((prev, curr) => {
              return typeof curr.data[target].value !== "undefined" ?
                prev + parseFloat(curr.data[target].value) : prev;
            }, 0);

            const avg = sum / filtered.length;

            monthlyData[month][latlng] = {
              ...monthlyData[month][latlng],
              [target]: { value: avg, unit: filtered[0]?.data[target]?.unit }
            };
          }
        }
      }

      let newGeoJsonData = {
        "type": "FeatureCollection",
        "features": []
      };

      // Now go through the monthlyData and format it into a GeoJSON object
      for (const month in monthlyData) {
        for (const latlng in monthlyData[month]) {
          const [latitude, longitude] = latlng.split(",");

          const feature = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [parseFloat(longitude), parseFloat(latitude)]
            },
            "properties": {
              "month": month,
              "latitude": latitude,
              "longitude": longitude,
              "battery": parseFloat(monthlyData[month][latlng].battery.value.toFixed(2)),
              "battery_unit": monthlyData[month][latlng].battery.unit,
              "height": parseFloat(monthlyData[month][latlng].height.value.toFixed(2)),
              "height_unit": monthlyData[month][latlng].height.unit,
              "speed": parseFloat(monthlyData[month][latlng].speed.value.toFixed(2)),
              "speed_unit": monthlyData[month][latlng].speed.unit,
              "temperature": parseFloat(monthlyData[month][latlng].temperature.value.toFixed(2)),
              "temperature_unit": monthlyData[month][latlng].temperature.unit,
              "oxygen": parseFloat(monthlyData[month][latlng].oxygen.value.toFixed(2)),
              "oxygen_unit": monthlyData[month][latlng].oxygen.unit,
            }
          };

          newGeoJsonData.features.push(feature);
        }
      }

      // The world isn't flat but we only need a rough estimate of the center
      const centerLat = uniqueLatlngs.reduce((prev, curr) => {
        return prev + parseFloat(curr.split(",")[0]);
      }, 0) / uniqueLatlngs.length;
      const centerLng = uniqueLatlngs.reduce((prev, curr) => {
        return prev + parseFloat(curr.split(",")[1]);
      }, 0) / uniqueLatlngs.length;

      setMapData({
        ...mapData,
        geoJsonData: newGeoJsonData,
        center: [centerLng, centerLat],
        monthRange: Object.keys(monthlyData),
        selectedMonth: 0,
        month: Object.keys(monthlyData)[0],
        dataLoaded: true
      });
    } else {
      setMapData({ ...mapData, dataLoaded: false });
    }
  }, [filteredSensorData]);

  return (
    <div>
      {!mapData.dataLoaded && (
        <div role="alert" className="alert alert-info">
          <FontAwesomeIcon icon={faCircleInfo} className="text-2xl" />
          <span>Please select a sensor in the filter panel</span>
        </div>
      )}

      {mapData.dataLoaded && (<>
        <div className="flex justify-center items-center mb-4">
          <div className="join">
            <button className={`join-item btn btn-xs sm:btn-md ${mapData.display === "temperature" && "btn-primary"}`}
              onClick={() => setMapData({ ...mapData, display: "temperature" })}>
              Temperature
            </button>
            <button className={`join-item btn btn-xs sm:btn-md ${mapData.display === "oxygen" && "btn-primary"}`}
              onClick={() => setMapData({ ...mapData, display: "oxygen" })}>
              Oxygen
            </button>
            <button className={`join-item btn btn-xs sm:btn-md ${mapData.display === "battery" && "btn-primary"}`}
              onClick={() => setMapData({ ...mapData, display: "battery" })}>
              Battery
            </button>
            <button className={`join-item btn btn-xs sm:btn-md ${mapData.display === "height" && "btn-primary"}`}
              onClick={() => setMapData({ ...mapData, display: "height" })}>
              Height
            </button>
            <button className={`join-item btn btn-xs sm:btn-md ${mapData.display === "speed" && "btn-primary"}`}
              onClick={() => setMapData({ ...mapData, display: "speed" })}>
              Speed
            </button>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-center">
            {format(new Date(mapData.monthRange[mapData.selectedMonth]), "MMM yyyy")}
          </span>

          <input type="range" min={0} max={mapData.monthRange.length - 1} value={mapData.selectedMonth} className="range" step="1"
            onChange={(e) => setMapData({
              ...mapData, selectedMonth: e.target.value, month: mapData.monthRange[e.target.value]
            })} />

          <div className="w-full flex justify-between text-xs px-2">
            {mapData.monthRange.map((month, index) => {
              return (
                <span key={index} className="text-gray-400">|</span>
              );
            })}
          </div>
        </div>

        <MapBox mapData={mapData} />
      </>)}
    </div>
  );
};


export default SensorViewerMap;