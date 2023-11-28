
import { useState } from "react";

const SensorViewerTable = ({
  sensorData
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e, item) => {
    if (hoveredItem !== item) {
      setHoveredItem(item);
    }
    setHoveredCoords({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th className="text-lg">ID</th>
            <th className="text-lg">Sensor ID</th>
            <th className="text-lg">Direction</th>
            <th className="text-lg">Date</th>
            <th className="text-lg">Time</th>
            <th className="text-lg">Latitude</th>
            <th className="text-lg">Longitude</th>
          </tr>
        </thead>
        <tbody onMouseLeave={handleMouseLeave}>
          {sensorData.map((item) => {
            return (
              <tr className="hover" key={item.id}
                onMouseMove={e => { handleMouseMove(e, item); }}>
                <td>{item.id.slice(0, 8)}</td>
                <td>{item.sensorId.slice(0, 8)}</td>
                <td>{item.direction}</td>
                <td>{new Date(item.transmittedAt.iso).toLocaleDateString()}</td>
                <td>{new Date(item.transmittedAt.iso).toLocaleTimeString()}</td>
                <td>{item.latitude}</td>
                <td>{item.longitude}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {hoveredItem && (
        <div className="fixed card mt-6 ml-6 w-96 bg-base-300 text-base-content"
          style={{ top: `${hoveredCoords.y}px`, left: `${hoveredCoords.x}px` }}>
          <div className="card-body text-left">
            <table className="text-xs w-full">
              <tr>
                <td className="font-bold pr-4">ID:</td>
                <td>{hoveredItem.id}</td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Sensor:</td>
                <td>{hoveredItem.sensorId}</td>
              </tr>
            </table>
            <table className="text-sm w-full">
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
            </table>
          </div>
        </div>
      )}
    </>
  );

};

export default SensorViewerTable;