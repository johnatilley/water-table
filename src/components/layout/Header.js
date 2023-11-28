import logoWhite from "../../assets/images/logo-white.png";

import DarkModeToggle from "./DarkModeToggle";

const Header = () => {
  return (
    <header className="bg-water-blue">
      <div className="container py-4 flex justify-between items-center">
        <a href="/">
          <img src={logoWhite} className="max-w-sm" alt="Water Table" />
        </a>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;