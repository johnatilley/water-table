import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const DarkModeToggle = () => {
  // Load the darkmode setting from storage, or default to the user's OS setting
  const loadDarkMode =
    localStorage.getItem("darkMode")
      ? localStorage.getItem("darkMode")
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "on" : "off";

  const [darkMode, setDarkMode] = useState(loadDarkMode === "on" ? true : false);

  const handleToggle = (e) => {
    if (e.target.checked) {
      localStorage.setItem("darkMode", "on");
      setDarkMode(true);
    } else {
      localStorage.setItem("darkMode", "off");
      setDarkMode(false);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.querySelector("html").classList.remove("light");
      document.querySelector("html").classList.add("dark");
      document.querySelector("html").setAttribute("data-theme", "night");
    } else {
      document.querySelector("html").classList.remove("dark");
      document.querySelector("html").classList.add("light");
      document.querySelector("html").setAttribute("data-theme", "winter");
    }
  }, [darkMode]);

  return (
    <div className="flex items-center">
      <label className="swap swap-rotate">
        <input type="checkbox" onChange={handleToggle} checked={darkMode} />
        <FontAwesomeIcon icon={faSun} className="w-8 h-8 swap-off text-white" />
        <FontAwesomeIcon icon={faMoon} className="w-8 h-8 swap-on text-white" />
      </label>
    </div>
  );
};

export default DarkModeToggle;
