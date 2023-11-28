import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

/**
 * I'm just using your technical test as an excuse to experiment with DaisyUI and toggling dark mode
 * but this does serve as a good example of adding quality of life improvements to a site with very
 * little effort. Personally I think dark mode is a must for websites these days. You never know when
 * a user is going to be visiting the UI at night and it's nice to have the option to switch.
 */
const DarkModeToggle = () => {
  // Load the darkmode setting from storage, or default to the user's OS setting
  const userDarkModePref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "on" : "off";
  const loadDarkMode = localStorage.getItem("darkMode") ?? userDarkModePref;

  const [darkMode, setDarkMode] = useState(loadDarkMode === "on");

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
