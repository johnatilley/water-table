import { Fragment, useContext, useState } from "react";
import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown, faPlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import SensorViewerContext from "../SensorViewerContext";

const SensorViewerTable = () => {
  const { sensorData, sensorPaging, setSensorPaging } = useContext(SensorViewerContext);

  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState({ x: 0, y: 0 });
  const [addedColumns, setAddedColumns] = useState([]);

  const availableColumns = [
    { name: "temperature", label: "Temperature" },
    { name: "height", label: "Height" },
    { name: "speed", label: "Speed" },
    { name: "battery", label: "Battery" },
    { name: "alarm", label: "Alarm" },
    { name: "state", label: "State" },
    { name: "oxygen", label: "Oxygen" },
  ];

  const handleMouseMove = (e, item) => {
    if (hoveredItem !== item) {
      setHoveredItem(item);
    }
    setHoveredCoords({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleSort = (sortBy) => {
    if (sensorPaging.sortBy === sortBy) {
      setSensorPaging({ ...sensorPaging, sortDirection: sensorPaging.sortDirection === "asc" ? "desc" : "asc" });
    } else {
      setSensorPaging({ ...sensorPaging, sortBy: sortBy, sortDirection: "asc" });
    }
  };

  const addColumn = (column) => {
    setAddedColumns([...addedColumns, column]);
  };

  const removeColumn = (column) => {
    setAddedColumns(addedColumns.filter((item) => { return item.name !== column.name; }));
  };

  return (
    <div className="relative">
      <div className="flex justify-center mb-4 lg:absolute bottom-full left-0">
        <Menu as="div" className="relative inline-block">
          <Menu.Button className="btn btn-primary">
            Add columns
            <FontAwesomeIcon icon={faPlus} />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 top-full mt-2 z-[1] w-40 flex flex-col items-stretch
              gap-2 bg-neutral p-2 shadow-xl rounded-xl">
              {availableColumns
                .filter((column) => {
                  return !addedColumns.some((added) => added.name === column.name);
                })
                .map((column) => (
                  <Menu.Item key={column.name}>
                    <button className="btn btn-sm btn-secondary" onClick={() => addColumn(column)}>
                      {column.label}
                    </button>
                  </Menu.Item>
                ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="overflow-x-auto pt-4">
        <table className="table table-zebra table-xs text-center mb-8">
          <thead>
            <tr>
              <th className="lg:text-lg cursor-pointer">
                <span className="link-primary" onClick={() => handleSort("id")}>ID <FontAwesomeIcon
                  icon={sensorPaging.sortBy === "id" ? sensorPaging.sortDirection === "asc" ? faSortUp : faSortDown : faSort} /></span>
              </th>
              <th className="lg:text-lg cursor-pointer">
                <span className="link-primary" onClick={() => handleSort("sensorId")}>Sensor ID <FontAwesomeIcon
                  icon={sensorPaging.sortBy === "sensorId" ? sensorPaging.sortDirection === "asc" ? faSortUp : faSortDown : faSort} /></span>
              </th>
              <th className="lg:text-lg cursor-pointer">
                <span className="link-primary" onClick={() => handleSort("direction")}>Direction <FontAwesomeIcon
                  icon={sensorPaging.sortBy === "direction" ? sensorPaging.sortDirection === "asc" ? faSortUp : faSortDown : faSort} /></span>
              </th>
              <th className="lg:text-lg cursor-pointer">
                <span className="link-primary" onClick={() => handleSort("transmittedAt")}>Date and Time <FontAwesomeIcon
                  icon={sensorPaging.sortBy === "transmittedAt" ? sensorPaging.sortDirection === "asc" ? faSortUp : faSortDown : faSort} /></span>
              </th>
              <th className="lg:text-lg cursor-pointer">
                <span className="link-primary" onClick={() => handleSort("latitude")}>Latitude <FontAwesomeIcon
                  icon={sensorPaging.sortBy === "latitude" ? sensorPaging.sortDirection === "asc" ? faSortUp : faSortDown : faSort} /></span>
              </th>
              <th className="lg:text-lg cursor-pointer">
                <span className="link-primary" onClick={() => handleSort("longitude")}>Longitude <FontAwesomeIcon
                  icon={sensorPaging.sortBy === "longitude" ? sensorPaging.sortDirection === "asc" ? faSortUp : faSortDown : faSort} /></span>
              </th>
              {addedColumns.map((column) => (
                <th key={column.name} className="lg:text-lg cursor-pointer">
                  <span className="link-primary" onClick={() => handleSort(column.name)}>{column.label} <FontAwesomeIcon
                    icon={sensorPaging.sortBy === column.name ? sensorPaging.sortDirection === "asc" ? faSortUp : faSortDown : faSort} /></span>
                  {" "}
                  <span className="link-accent" onClick={() => removeColumn(column)}><FontAwesomeIcon
                    icon={faCircleXmark} /></span>
                </th>
              ))}

            </tr>
          </thead>
          <tbody onMouseLeave={handleMouseLeave}>
            {sensorData.map((item) => (
              <tr className="hover" key={item.id}
                onMouseMove={e => { handleMouseMove(e, item); }}>
                <td>{item.id}</td>
                <td>{item.sensorId}...</td>
                <td>{item.direction}</td>
                <td>{new Date(item.transmittedAt.iso).toLocaleString()}</td>
                <td>{item.latitude}</td>
                <td>{item.longitude}</td>
                {addedColumns.map((column) => (
                  <td key={item.id + "-" + column.name}>
                    {column.name === "alarm" && (item.data.alarm ? "Yes" : "No")}
                    {column.name === "state" && item.data.state}
                    {column.name !== "state" && column.name !== "alarm" && typeof item.data[column.name].value !== "undefined" && item.data[column.name].value + " " + item.data[column.name].unit}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hoveredItem && (
        <div className="hidden sm:card sm:fixed mt-6 ml-6 w-96 bg-base-300 text-base-content z-50"
          style={{ top: `${hoveredCoords.y}px`, left: `${hoveredCoords.x}px` }}>
          <div className="card-body text-left">
            <table className="text-xs w-full">
              <tbody>
                <tr>
                  <td className="font-bold pr-4">ID:</td>
                  <td>{hoveredItem.id}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-4">Sensor:</td>
                  <td>{hoveredItem.sensorId}</td>
                </tr>
              </tbody>
            </table>
            <table className="text-sm w-full">
              <tbody>
                <tr>
                  <td className="font-bold pr-4">Temperature</td>
                  <td>{hoveredItem.data.temperature.value} {hoveredItem.data.temperature.unit}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-4">Height</td>
                  <td>{hoveredItem.data.height.value} {hoveredItem.data.height.unit}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-4">Speed</td>
                  <td>{hoveredItem.data.speed.value} {hoveredItem.data.speed.unit}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-4">Battery</td>
                  <td>{hoveredItem.data.battery.value} {hoveredItem.data.battery.unit}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-4">Alarm</td>
                  <td>{hoveredItem.data.alarm ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-4">State</td>
                  <td>{hoveredItem.data.state}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-4">Oxygen</td>
                  <td>{hoveredItem.data.oxygen.value} {hoveredItem.data.oxygen.unit}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

};

export default SensorViewerTable;