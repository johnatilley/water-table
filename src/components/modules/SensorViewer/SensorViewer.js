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

  const [sensorFilter, setSensorFilter] = useState({
    id: "",
    sensorId: "",
    transmittedAtFrom: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
    transmittedAtTo: new Date(),
  });

  const [sensorPaging, setSensorPaging] = useState({
    page: 1,
    pageSize: 50,
    sortBy: "transmittedAt",
    sortDirection: "desc"
  });

  /**
   * This useEffect will download the data from the server and store it in the state
   */
  useEffect(() => {
    setIsLoaded(false);
    setProgress(0);
    // The server address is hardcoded here, but in a real app this would be in a config file or env variables.
    // ie. I'm lazy and it's unpaid work after all :)
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

        // Go through all the data and find the min and max dates in transmittedAt and set the filter
        // to those dates as a starting point
        const minDate = new Date(newData.reduce((prev, curr) => {
          return new Date(curr.transmittedAt.iso) < new Date(prev.transmittedAt.iso) ? curr : prev;
        }).transmittedAt.iso);
        const maxDate = new Date(newData.reduce((prev, curr) => {
          return new Date(curr.transmittedAt.iso) > new Date(prev.transmittedAt.iso) ? curr : prev;
        }).transmittedAt.iso);

        setSensorFilter({
          ...sensorFilter,
          transmittedAtFrom: minDate,
          transmittedAtTo: maxDate
        });

        setDownloadedSensorData(newData);
        setIsLoaded(true);
      });
  }, []); // Run once

  /**
   * This useEffect will filter out the data based on the filter settings
   */
  useEffect(() => {
    const filteredSensorData = downloadedSensorData.filter((item) => {
      const isIdMatch = sensorFilter.id !== "" ? item.id.includes(sensorFilter.id) : true;
      const isSensorIdMatch = sensorFilter.sensorId !== "" ? item.sensorId === sensorFilter.sensorId : true;

      const isInDateRange = new Date(item.transmittedAt.iso) >= sensorFilter.transmittedAtFrom &&
        new Date(item.transmittedAt.iso) <= sensorFilter.transmittedAtTo;

      return isIdMatch && isSensorIdMatch && isInDateRange;
    });

    setFilteredSensorData(filteredSensorData);
    setSensorPaging({ ...sensorPaging, page: parseInt(1) });
  }, [downloadedSensorData, sensorFilter]); // Run once

  /**
   * This useEffect will filter out the data based on the pagination settings
   */
  useEffect(() => {

    /**
     * Is this a stupid overly complex way to pick a sorting function based on the column name? ¯\_(ツ)_/¯ Probably yes.
     * As the data is slightly different for each column, we need to handle each column differently. This is a good excuse
     * to use a switch statement instead of a bunch of if statements as we can group the cases together if they have the
     * same data structure.
     *
     * We use sortMatch to determine if we should sort ascending or descending. If the sortDirection is ascending, then
     * sortMatch will be 1, otherwise it will be -1. This is the second easiest way to reverse the sort order because as
     * I'm typing this very comment I realise now that it may have been easier to just test the sortDirection and use
     * array.reverse() instead of this maths, but the downside to that does mean we'd be sorting the array twice, which
     * might be a bad idea given there are 10,000 entries. If I had time I'd love to measure the performance of both methods
     * to see which is faster.
     */
    const sortMatch = sensorPaging.sortDirection === "asc" ? 1 : -1;
    let sortFunction;

    switch (sensorPaging.sortBy) {
      case "transmittedAt":
        sortFunction = (a, b) => { return new Date(a.transmittedAt.iso) > new Date(b.transmittedAt.iso) ? sortMatch : -1 * sortMatch; };
        break;
      case "battery":
      case "height":
      case "speed":
      case "temperature":
        sortFunction = (a, b) => {
          return a.data[sensorPaging.sortBy].value > b.data[sensorPaging.sortBy].value ? sortMatch : -1 * sortMatch;
        };
        break;
      case "oxygen":
        sortFunction = (a, b) => {
          return parseFloat(a.data[sensorPaging.sortBy].value ?? -1) > parseFloat(b.data[sensorPaging.sortBy].value ?? -1) ? sortMatch : -1 * sortMatch;
        };
        break;
      case "alarm":
      case "state":
        sortFunction = (a, b) => {
          return a.data[sensorPaging.sortBy] > b.data[sensorPaging.sortBy] ? sortMatch : -1 * sortMatch;
        };
        break;
      default:
        sortFunction = (a, b) => { return a[sensorPaging.sortBy] > b[sensorPaging.sortBy] ? sortMatch : -1 * sortMatch; };
        break;
    };

    // toSorted is a relatively new function in the EMCA specification and is the immutible version of sort
    const sortedSensorData = filteredSensorData.toSorted(sortFunction);

    const pagedSensorData = sortedSensorData.slice(
      (sensorPaging.page - 1) * sensorPaging.pageSize, sensorPaging.page * sensorPaging.pageSize
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
        sensorPaging,
        setSensorPaging,
        sensorData,
        setSensorData,
        filteredSensorData,
        setFilteredSensorData,
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
              <SensorViewerFilter />

              <Tab.Group>
                <Tab.List className="flex justify-center items-center mb-4 join">
                  <Tab
                    className="btn ui-selected:btn-primary ui-not-selected:btn-base join-item">
                    Table
                  </Tab>
                  <Tab
                    className="btn ui-selected:btn-primary ui-not-selected:btn-base join-item">
                    Graph
                  </Tab>
                  <Tab
                    className="btn ui-selected:btn-primary ui-not-selected:btn-base join-item">
                    Map
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <SensorViewerPagination />
                    <SensorViewerTable />
                    <SensorViewerPagination />
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