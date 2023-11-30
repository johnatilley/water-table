import { useContext, useState } from "react";
import AnimateHeight from 'react-animate-height';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import SensorViewerContext from "../SensorViewerContext";
import SensorDatePicker from "./SensorDatePicker";

const SensorViewerFilter = () => {
  const { sensorFilter, setSensorFilter, downloadedSensorData } = useContext(SensorViewerContext);
  const [open, setOpen] = useState(false);

  const uniqueSensorIds = [...new Set(downloadedSensorData.map(item => item.sensorId))];

  // Go through all the data and find the min and max dates in data.transmittedAt.
  // These are the limits for the filter even after changing them.
  const minDate = new Date(downloadedSensorData.reduce((prev, curr) => {
    return new Date(curr.transmittedAt.iso) < new Date(prev.transmittedAt.iso) ? curr : prev;
  }).transmittedAt.iso);
  const maxDate = new Date(downloadedSensorData.reduce((prev, curr) => {
    return new Date(curr.transmittedAt.iso) > new Date(prev.transmittedAt.iso) ? curr : prev;
  }).transmittedAt.iso);

  const handleSearch = (e) => {
    setSensorFilter({
      ...sensorFilter,
      [e.target.name]: e.target.value
    });
  };

  const handleSelect = (e) => {
    setSensorFilter({
      ...sensorFilter,
      [e.target.name]: e.target.value
    });
  };

  const handleDate = (name, date) => {
    setSensorFilter({
      ...sensorFilter,
      [name]: new Date(date)
    });
  };


  return (
    <>
      <button
        className="sm:absolute top-0 right-0 btn btn-secondary mb-4"
        onClick={() => { setOpen(!open); }}>
        {open ? "Close" : "Open"} Filters <FontAwesomeIcon icon={faFilter} />
      </button>

      <AnimateHeight duration={500} height={open ? "auto" : 0} >
        <div className="bg-base-200 p-4 pb-6 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Search IDs</span>
            </div>
            <input type="text" placeholder="Search IDs" className="input input-bordered w-full"
              value={sensorFilter.id} name="id" onChange={handleSearch} />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Filter Sensors</span>
            </div>

            <select className="select select-bordered w-full"
              value={sensorFilter.sensorId} name="sensorId" onChange={handleSelect}>
              <option value="">Sensor ID</option>
              {uniqueSensorIds.map((sensorId) => (
                <option key={sensorId} value={sensorId}>{sensorId}</option>
              ))}
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Date from</span>
            </div>
            <SensorDatePicker className="input input-bordered w-full flex items-center"
              onChange={(date) => { handleDate("transmittedAtFrom", date); }}
              startDate={sensorFilter.transmittedAtFrom} endDate={sensorFilter.transmittedAtTo}
              selectsStart selected={sensorFilter.transmittedAtFrom}
              minDate={minDate} maxDate={maxDate}
              showMonthYearPicker
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Date to</span>
            </div>
            <SensorDatePicker className="input input-bordered w-full"
              onChange={(date) => { handleDate("transmittedAtTo", date); }}
              startDate={sensorFilter.transmittedAtFrom} endDate={sensorFilter.transmittedAtTo}
              selectsEnd selected={sensorFilter.transmittedAtTo}
              minDate={sensorFilter.transmittedAtFrom} maxDate={maxDate}
              showMonthYearPicker
            />
          </label>

        </div>
      </AnimateHeight>
    </>
  );
};

export default SensorViewerFilter;