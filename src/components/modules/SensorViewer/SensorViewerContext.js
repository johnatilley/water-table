import { createContext } from "react";

const SensorViewerContext = createContext({
  isLoaded: false,
  setIsLoaded: () => {},
  progress: 0,
  setProgress: () => {},
  sensorFilter: [],
  setSensorFilter: () => {},
  sensorPaging: [],
  setSensorPaging: () => {},
  sensorData: [],
  setSensorData: () => {},
  downloadedSensorData: [],
  setDownloadedSensorData: () => {},
});

export default SensorViewerContext;