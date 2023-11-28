import { Transition } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

/**
 * We don't use cookies on this site but if we did we would need to ask the user.
 * Really I've only added this to show how to use the react-cookie package and
 * play around with transitions.
 */
const CookieConsent = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [cookies, setCookie] = useCookies(["cookieConsent"]);

  const handleClick = (option) => {
    setCookie("cookieConsent", option);
    setIsShowing(false);
  };

  useEffect(() => {
    console.log(cookies.cookieConsent);
    if (cookies.cookieConsent) {
      setIsShowing(false);
    } else {
      setTimeout(() => { setIsShowing(true); }, 0); // Force async so Transition fades into view on first load
    }
  }, [cookies.cookieConsent]);

  return (
    <Transition
      className="fixed bottom-12 left-4 right-4 rounded-lg shadow-lg bg-info text-info-content container"
      show={isShowing}
      enter="transition-opacity duration-1000"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-350"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex justify-between items-center gap-4 p-4">
        <p className="text-sm mr-auto">
          This website doesn't use cookies but if it did would you accept them?
        </p>
        <button className="btn btn-ghost" onClick={() => { handleClick("no"); }}>Decline</button>
        <button className="btn" onClick={() => { handleClick("yes"); }}>Accept</button>
      </div>
    </Transition>
  );
};

export default CookieConsent;