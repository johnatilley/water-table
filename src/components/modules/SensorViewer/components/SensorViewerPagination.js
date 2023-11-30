import { useContext, useEffect, useState } from "react";
import { range } from "lodash";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAngleLeft, faAngleRight, faAnglesRight, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import SensorViewerContext from "../SensorViewerContext";

const SensorViewerPagination = () => {
  const { sensorPaging, setSensorPaging, filteredSensorData } = useContext(SensorViewerContext);
  const [goToPage, setGoToPage] = useState(null);
  const [goToPageError, setGoToPageError] = useState(false);

  // Get maximum number of pages based on sensorPaging.pageSize and filteredSensorData.length
  const currentPage = parseInt(sensorPaging.page);
  const maxPages = parseInt(Math.ceil(filteredSensorData.length / parseInt(sensorPaging.pageSize)));
  const prevPage = parseInt(currentPage) - 1 > 0 ? parseInt(currentPage) - 1 : 1;
  const nextPage = parseInt(currentPage) + 1 < maxPages ? parseInt(currentPage) + 1 : maxPages;

  // Work out a range of pages
  let pageLimits = [currentPage - 2, currentPage + 2];
  if (maxPages <= 5) {
    pageLimits = [1, maxPages];
  } else {
    if (pageLimits[0] < 2) {
      pageLimits[1] += 2 - pageLimits[0];
      pageLimits[0] = 2;
    }
    if (pageLimits[1] > maxPages - 1) {
      pageLimits[0] -= pageLimits[1] - maxPages + 1;
      pageLimits[1] = maxPages - 1;
    }
  }
  const pageRange = range(pageLimits[0], pageLimits[1] + 1);

  const handlePage = (newPage) => {
    if (typeof newPage !== undefined && newPage > 0 && newPage <= maxPages) {
      setSensorPaging({
        ...sensorPaging,
        page: newPage
      });
      setGoToPage(null);
      setGoToPageError(false);
    }
  };

  const handleGoToPage = (newPage) => {
    if (typeof newPage !== undefined && newPage !== null) {
      if (newPage > 0 && newPage <= maxPages) {
        handlePage(newPage);
      } else {
        setGoToPageError(true);
      }
    }
  };

  return (
    <div className="relative">
      <div className="hidden lg:join absolute right-0 mb-4">
        <input className={`join-item input input-bordered input-primary w-32 ${goToPageError && "input-warning"}`}
          type="text" placeholder="Go to page" value={goToPage !== null ? goToPage : ""} onChange={(e) => setGoToPage(parseInt(e.target.value))} />

        <button className={`join-item btn btn-primary ${goToPageError && "btn-warning"}`}
          onClick={() => handleGoToPage(goToPage)}>
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>

      <div className="flex sm:hidden justify-center gap-2 mb-4">
        <div className="join">
          <button className={`join-item btn ${currentPage === 1 && "btn-disabled"}`} onClick={() => handlePage(prevPage)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button key={currentPage} className={`join-item w-16 btn`}>
            {currentPage}
          </button>
          <button className={`join-item btn ${currentPage === maxPages && "btn-disabled"}`} onClick={() => handlePage(nextPage)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>

      <div className="hidden sm:flex justify-center gap-2 mb-4">
        <div className="join">
          <button className={`join-item btn ${currentPage === 1 && "btn-disabled"}`} onClick={() => handlePage(prevPage)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button className={`join-item btn ${currentPage === 1 && "btn-primary"}`} onClick={() => handlePage(1)} >
            1
          </button>
        </div>

        <div className="join">
          {pageRange.map((page) => {
            return (
              <button key={page} className={`join-item btn ${currentPage === page && "btn-primary"}`}
                onClick={() => handlePage(page)}>
                {page}
              </button>
            );
          })}
        </div>

        <div className="join">
          <button className={`join-item btn ${currentPage === maxPages && "btn-primary"}`} onClick={() => handlePage(maxPages)}>
            {maxPages}
          </button>
          <button className={`join-item btn ${currentPage === maxPages && "btn-disabled"}`} onClick={() => handlePage(nextPage)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SensorViewerPagination;