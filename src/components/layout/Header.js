import logoWhite from "../../assets/images/logo-white.png";

import DarkModeToggle from "./DarkModeToggle";

/**
 * People say frontend and backend is just two different sides of writing code, but I disagree.
 * When you go in the frontend direction you should have an intimate knowledge of image formats
 * and how they are displayed. This is why I've added a logo to the assets folder and imported
 * it here. The image file is 615px wide and is being displayed at around 380px wide. The reason
 * behind this is to make the logo look crisp on retina/high pixel density screens.
 */
const Header = () => {
  return (
    <header className="bg-water-blue">
      <div className="container py-8 flex justify-between items-center">
        <a href="/">
          <img src={logoWhite} className="max-w-sm" alt="Water Table" />
        </a>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;