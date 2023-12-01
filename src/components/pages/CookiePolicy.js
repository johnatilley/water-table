import { Link } from "react-router-dom";

/**
 * Did I need to add a cookie policy page? No. But I did anyway.
 * This provides an example of how to add a static page to the site
 * that keeps it separate from functional pages found in the modules
 * directory.
 */
const CookiePolicy = () => {
  return (
    <div className="container py-4 lg:py-12 text-center">
      <h1 className="mb-4">Cookie Policy</h1>
      <p>You fool! This site doesn't use cookies!</p>
      <p className="mb-4">Why did you come here? The cookie consent pop up clearly said we don't use cookies!</p>
      <p><Link className="btn btn-primary" to={"/"}>Return to Homepage</Link></p>
    </div>
  );
}

export default CookiePolicy;