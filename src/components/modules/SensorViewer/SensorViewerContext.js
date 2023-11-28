import { createContext } from "react";

const SensorViewerContext = createContext({
  isLoaded: false,
  setIsLoaded: () => {},
  progress: 0,
  setProgress: () => {},
  sensorFilter: [],
  setSensorFilter: () => {},
  sensorData: [],
  setSensorData: () => {},
  downloadedSensorData: [],
  setDownloadedSensorData: () => {},
});

export default SensorViewerContext;