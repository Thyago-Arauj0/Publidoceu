'use client'

import { useEffect, useRef } from 'react';
import Scrollbar from 'smooth-scrollbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const options = {
  damping: 0.07,
};

const Scroll = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollbar = Scrollbar.init(scrollRef.current, options);


    ScrollTrigger.scrollerProxy(scrollRef.current, {
      scrollTop(value) {
        if (arguments.length) {
          scrollbar.scrollTop = value;
        }
        return scrollbar.scrollTop;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollRef.current.style.transform ? 'transform' : 'fixed',
    });


    scrollbar.addListener(ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: scrollRef.current });

    return () => {
      scrollbar.destroy();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      id="scroll-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
};

export default Scroll;




// import Scrollbar from 'smooth-scrollbar';
// import { useEffect, useRef } from 'react';

// const options = {
//   damping: 0.07,
// };

// const Scroll = ({ children }) => {
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     if (!scrollRef.current) return;

//     const scrollbar = Scrollbar.init(scrollRef.current, options);

//     return () => {
//       scrollbar.destroy();
//     };
//   }, []);

//   return (
//     <div
//       ref={scrollRef}
//       id="scroll-container"
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         overflow: 'hidden',
//       }}
//     >
//       <div style={{ minHeight: '100vh' }} >
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Scroll;
