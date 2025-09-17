
import React, { useEffect, useState } from 'react';
import './AnimatedBackground.css';

interface FloatingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  type: 'cloud' | 'balloon' | 'instagram' | 'idea';
  opacity: number;
  variant?: number;
}

const AnimatedBackground: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const initialItems: FloatingItem[] = [];
    const types: ('cloud' | 'balloon' | 'instagram' | 'idea')[] = [
      'cloud', 'cloud', 'cloud', 'cloud', 
      'balloon', 'balloon',
      'instagram', 'instagram',
      'idea', 'idea'
    ];

    for (let i = 0; i < 30; i++) { 
      const type = types[Math.floor(Math.random() * types.length)];
      initialItems.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.2 + Math.random() * 0.8,
        size: type === 'cloud' ? 40 + Math.random() * 60 : 20 + Math.random() * 40, 
        rotation: Math.random() * 360,
        type,
        opacity: type === 'cloud' ? 0.7 + Math.random() * 0.3 : 0.4 + Math.random() * 0.6,
        variant: type === 'cloud' ? Math.floor(Math.random() * 3) : undefined 
      });
    }

    setItems(initialItems);


    const animationInterval = setInterval(() => {
      setItems(prevItems =>
        prevItems.map(item => {
          let newY = item.y + item.speed * 0.1;
          let newX = item.x;
          

          if (item.type === 'cloud') {
            newX += Math.sin(Date.now() / (2000 + item.id * 10) + item.id) * 0.1;
          }
          

          if (newY > 100) {
            newY = -10;
            newX = Math.random() * 100;
          }
          
          return {
            ...item,
            x: newX,
            y: newY,
            rotation: item.type !== 'cloud' ? item.rotation + (item.speed * 0.5) : 0
          };
        })
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  const renderCloud = (item: FloatingItem) => {

    const cloudStyle = {
      width: `${item.size}px`,
      height: `${item.size * 0.6}px`,
      opacity: item.opacity,
      filter: `blur(${item.size * 0.02}px)`
    };

    switch(item.variant) {
      case 0: 
        return (
          <div className="cloud cute" style={cloudStyle}>
            <div className="cloud-part main"></div>
            <div className="cloud-part left"></div>
            <div className="cloud-part right"></div>
            <div className="cloud-part top"></div>
          </div>
        );
      case 1:
        return (
          <div className="cloud minimal" style={cloudStyle}>
            <div className="cloud-circle big"></div>
            <div className="cloud-circle medium"></div>
            <div className="cloud-circle small"></div>
          </div>
        );
      case 2: 
      default:
        return (
          <div className="cloud cartoon" style={cloudStyle}>
            <div className="cloud-curve"></div>
            <div className="cloud-curve reverse"></div>
          </div>
        );
    }
  };

  const getItemElement = (item: FloatingItem) => {
    const baseStyle = {
      transform: `rotate(${item.rotation}deg)`,
      width: `${item.size}px`,
      height: `${item.size}px`,
      opacity: item.opacity,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${item.size * 0.6}px`
    };

    switch (item.type) {
      case 'cloud':
        return renderCloud(item);
      case 'balloon':
        return (
          <div className="balloon" style={{
            backgroundColor: `hsla(${item.id * 10}, 100%, 70%, ${item.opacity})`,
            width: `${item.size}px`,
            height: `${item.size * 1.2}px`,
          }} />
        );
      case 'instagram':
        return (
          <div style={baseStyle}>
            <svg viewBox="0 0 24 24" width={item.size} height={item.size}>
              <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );
      case 'idea':
        return (
          <div style={{...baseStyle, color: `hsla(${item.id * 15}, 100%, 60%, ${item.opacity})`}}>
            💡
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animated-background">
      {items.map(item => (
        <div
          key={item.id}
          className="floating-item"
          style={{
            left: `${item.x}vw`,
            top: `${item.y}%`,
            transition: `top ${item.speed * 0.5}s linear`,
            '--rotation': `${item.rotation}deg` 
          } as React.CSSProperties}
        >
          {getItemElement(item)}
        </div>
      ))}
    </div>
  );
};

export default AnimatedBackground;