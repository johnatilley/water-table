import { useContext, useEffect, useState } from "react";
import { startOfMonth, isBefore, addMonths, format } from "date-fns";

// import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import SensorViewerContext from "../SensorViewerContext";

const SensorViewerMap = () => {
  const { filteredSensorData, sensorFilter } = useContext(SensorViewerContext);

  const [monthlySensorData, setMonthlySensorData] = useState([]);

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

      // Loop through each month
      for (const month in monthlyData) {
        // Loop through each unique location
        for (const latlng of uniqueLatlngs) {
          // Filter out formattedSensorData to only include the current month and current location
          const filtered = formattedSensorData.filter((item) => {
            return item.latlng === latlng && format(new Date(item.transmittedAt.iso), "yyyy-MM") === month;
          });

          for (const target of targetDataForAvg) {
            const sum = filtered.reduce((prev, curr) => {
              return prev + parseFloat(curr.data[target].value);
            }, 0);

            const avg = sum / filtered.length;

            monthlyData[month][latlng] = {
              ...monthlyData[month][latlng],
              [target]: avg.toFixed(2) + filtered[0].data[target].unit
            };
          }
        }
      }

      setMonthlySensorData(monthlyData);
    }
  }, [filteredSensorData, sensorFilter]);

  console.log(monthlySensorData);

  return (
    <div>
      {sensorFilter.sensorId === "" && (
        <div role="alert" className="alert alert-info">
          <FontAwesomeIcon icon={faCircleInfo} className="text-2xl" />
          <span>Please select a sensor in the filter panel</span>
        </div>
      )}

      {sensorFilter.sensorId !== "" && (
        <h1>Put the map here</h1>
      )}
    </div>
  );
};


export default SensorViewerMap;