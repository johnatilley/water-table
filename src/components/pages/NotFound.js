
import image404 from '../../assets/images/404.jpg';

const NotFound = () => {
  return (
    <div className="container py-4 lg:py-12 text-center">
      <h1 className="mb-4">404: Page not found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <img src={image404} className="max-w-sm mx-auto my-4" alt="404: Page not found" />
    </div>
  );
};

export default NotFound;