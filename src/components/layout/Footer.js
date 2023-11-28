const Footer = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 py-12">
      <div className="container flex justify-between items-center">
        <p><a href="/cookie-policy">Cookie policy</a></p>
        {/* Get current year for copyright */}
        <p className="text-right">
          &copy; {new Date().getFullYear()} Water Table<br />By John Tilley
        </p>
      </div>
    </footer>
  );
};

export default Footer;