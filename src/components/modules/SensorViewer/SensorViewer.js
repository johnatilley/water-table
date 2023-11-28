import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab } from '@headlessui/react';

import SensorViewerContext from './SensorViewerContext';
import SensorViewerFilter from './components/SensorViewerFilter';
import SensorViewerPagination from './components/SensorViewerPagination';
import SensorViewerTable from './components/SensorViewerTable';


/**
 * This is where the app will go believe it or not
 */
const SensorViewer = () => {
  /**
   * We create two copies of the data, one for the raw data from the server and
   * one for displaying after filtering and paginating the original copy of the data.
   * This saves us from having to re-download the data from the server every time we want
   * to change the page or filter the data.
   */
  const [sensorData, setSensorData] = useState([]);
  const [filteredSensorData, setFilteredSensorData] = useState([]);
  const [downloadedSensorData, setDownloadedSensorData] = useState([]);

  /**
   * These states help control flow of the data
   */
  const [isLoaded, setIsLoaded] = useState(false); // We'll use this later
  const [progress, setProgress] = useState(0);
  const [sensorFilter, setSensorFilter] = useState({});
  const [sensorPaging, setSensorPaging] = useState({ page: 1, pageSize: 100 });

  /**
   * This effect will download the data from the server and store it in the state
   */
  useEffect(() => {
    setIsLoaded(false);
    setProgress(0);
    axios
      .get("http://127.0.0.1:4000/api/river_sensor_data", {
        onDownloadProgress: ({ progress }) => {
          setProgress(progress * 100);
        },
      })
      .then((response) => {
        // Ideally the Server would decode the payload before sending it
        const newData = response.data.map((item) => {
          return { ...item, data: JSON.parse(atob(item.payload)), };
        });

        setDownloadedSensorData(newData);
        setIsLoaded(true);
      });
  }, []); // Run once

  /**
   * This effect will filter out the data based on the filter settings
   */
  useEffect(() => {
    const filteredSensorData = downloadedSensorData.filter((item) => {
      return true;
    });

    setFilteredSensorData(filteredSensorData);
  }, [downloadedSensorData, sensorFilter]); // Run once

  /**
   * This effect will filter out the data based on the pagination settings
   */
  useEffect(() => {
    const pagedSensorData = filteredSensorData.slice(
      (sensorPaging.page - 1) * sensorPaging.pageSize,
      sensorPaging.page * sensorPaging.pageSize
    );

    setSensorData(pagedSensorData);
  }, [filteredSensorData, sensorPaging]); // Run once

  return (
    <SensorViewerContext.Provider
      value={{
        isLoaded,
        setIsLoaded,
        progress,
        setProgress,
        sensorFilter,
        setSensorFilter,
        sensorData,
        setSensorData,
        downloadedSensorData,
        setDownloadedSensorData,
      }}>
      <div className="container py-4 lg:py-12 text-center">
        <div className='relative'>
          <h1 className="py-2 mb-4">Water Table</h1>
          {!isLoaded && (<>
            <p className="text-lg">Loading...</p>
            <progress className="progress progress-primary w-56" value={progress} max="100"></progress>
          </>)}
          {isLoaded && (
            <>
              <SensorViewerFilter sensorFilter={sensorFilter} setSensorFilter={setSensorFilter} />

              <Tab.Group>
                <Tab.List className="flex justify-center items-center gap-4 mb-4">
                  <Tab
                    className="btn ui-selected:btn-primary ui-not-selected:btn-base">
                    Table View
                  </Tab>
                  <Tab
                    className="btn ui-selected:btn-primary ui-not-selected:btn-base">
                    Graph View
                  </Tab>
                  <Tab
                    className="btn ui-selected:btn-primary ui-not-selected:btn-base">
                    Map View
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <SensorViewerPagination sensorData={filteredSensorData} />
                    <SensorViewerTable sensorData={sensorData} />
                    <SensorViewerPagination sensorData={filteredSensorData} />
                  </Tab.Panel>
                  <Tab.Panel></Tab.Panel>
                  <Tab.Panel></Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </>
          )}
        </div>
      </div>
    </SensorViewerContext.Provider>
  );
};

export default SensorViewer;