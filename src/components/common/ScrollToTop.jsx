// src/components/common/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname, key } = useLocation();

  useEffect(() => {
    // Force scroll to top on any route change (including back/forward)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, key]); // Adding 'key' ensures it triggers on back/forward navigation

  return null;
}

export default ScrollToTop;