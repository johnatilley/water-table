import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';
import { Routes, Route } from 'react-router-dom';

import WaterTable from './components/modules/WaterTable';

import CookiePolicy from './components/pages/CookiePolicy';
import NotFound from './components/pages/NotFound';

/**
 * Here in the app file we define our flexbox layout for the outer parts of the
 * site (header main footer). We set up a wrapper with min-h-screen
 * (min-height: 100vh;) to make the site fill out the entire viewport. Then we
 * set grow (grow: 1;) on main to make it expand to fill out the remaining
 * space if the content is not scrollable.
 */
const App = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="grow">
        <Routes>
          <Route path="/" element={<WaterTable />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default App;
