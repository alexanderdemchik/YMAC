import { animated, useSpring } from '@react-spring/web';
import React from 'react';

interface FadeTransitionProps {
  children: JSX.Element,
  open: boolean,
  className?: string
}

export const FadeTransition = ({ children, open, className = '' }: FadeTransitionProps) => {
  const styles = useSpring({
    from: { opacity: 0 },
    to: {
      opacity: open ? 1 : 0,
    }
  }); 

  return <animated.div style={{...styles, visibility: styles.opacity.to(o => o === 0 ? 'hidden' : 'visible')}} className={className}>
    { children }
  </animated.div>
}
