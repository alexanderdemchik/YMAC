import React, { useState, useEffect, useLayoutEffect, RefObject } from 'react';

export const useWidth = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const onResize = () => {
      if (ref.current) {
        setWidth(ref.current.clientWidth);
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [ref]);
  return width;
}
