import DatePicker from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";

import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const SensorDatePicker = ({
  className,
  onChange,
  startDate,
  endDate,
  minDate,
  maxDate,
  selectsStart,
  selectsEnd,
  selected
}) => {
  const years = range(getYear(minDate), getYear(maxDate) + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="m-4 flex justify-center gap-4 items-center">
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>

          <select className="select select-bordered select-sm" value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)}>
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select className="select select-bordered select-sm" value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </div>
      )}
      className={className}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      maxDate={maxDate}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      selected={selected}
      locale={enGB}
      dateFormat="P"
    />
  );
};

export default SensorDatePicker;