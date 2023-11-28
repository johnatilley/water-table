import { Link } from 'react-router-dom';

import image404 from '../../assets/images/404.jpg';

/**
 * Technically a site like this doesn't need to worry about catching
 * 404 errors but it's nice to have for the sake of completeness.
 */
const NotFound = () => {
  return (
    <div className="container py-4 lg:py-12 text-center">
      <h1 className="mb-4">404: Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <img className="max-w-sm mx-auto my-4 mb=4" src={image404} alt="404: Page not found" />
      <p><Link className="btn btn-primary" to={"/"}>Return to Homepage</Link></p>
    </div>
  );
};

export default NotFound;