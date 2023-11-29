import { useContext, useState } from "react";

import SensorViewerContext from "../SensorViewerContext";

const SensorViewerPagination = () => {
  const { sensorPaging, setSensorPaging, downloadedSensorData } = useContext(SensorViewerContext);

};

export default SensorViewerPagination;