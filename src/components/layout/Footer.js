import { Link } from "react-router-dom";

/**
 * Adding a footer so it looks like a real website, the site can't run without it!
 */
const Footer = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 py-12">
      <div className="container flex justify-between items-center">
        <p><Link className="link-primary" to={"/cookie-policy"}>Cookie policy</Link></p>
        <p className="text-right">
          &copy; {new Date().getFullYear()} Water Table<br />By John Tilley
        </p>
      </div>
    </footer>
  );
};

export default Footer;