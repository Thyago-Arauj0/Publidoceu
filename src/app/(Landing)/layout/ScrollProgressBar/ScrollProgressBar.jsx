import { useEffect, useState } from 'react';
import Scrollbar from 'smooth-scrollbar';

export default function ScrollProgressBar() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const scrollbar = Scrollbar.get(document.querySelector('#scroll-container'));
    if (!scrollbar) return;

    const handleScroll = () => {
      const scrollTop = scrollbar.scrollTop;
      const docHeight = scrollbar.limit.y;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollWidth(scrollPercent);
    };

    scrollbar.addListener(handleScroll);
    return () => scrollbar.removeListener(handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: `${scrollWidth}%`,
      height: '4px',
      backgroundColor: '#eacad9',
      zIndex: 9999,
      transition: 'width 0.2s ease-out',
    }} />
  );
}
