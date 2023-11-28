import { useState } from "react";
import AnimateHeight from 'react-animate-height';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const SensorViewerFilter = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="absolute top-0 right-0 btn btn-secondary"
        onClick={() => { setOpen(!open); }}>
        {open ? "Close" : "Open"} Filters <FontAwesomeIcon icon={faFilter} />
      </button>
      <AnimateHeight duration={500} height={open ? "auto" : 0} >
        <div className="mb-8">Filters go here</div>
      </AnimateHeight>
    </>
  );
};

export default SensorViewerFilter;