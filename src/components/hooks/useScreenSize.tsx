"use client"
import { useState, useEffect } from 'react';

type ScreenSize = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const getScreenSize = (width: number): ScreenSize => {
  if (width < 640) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else if (width < 1280) {
    return 'laptop';
  } else {
    return 'desktop';
  }
};

const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    // Initialize with the current screen size
    return getScreenSize(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      const newSize = getScreenSize(window.innerWidth);
      setScreenSize(newSize);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;

