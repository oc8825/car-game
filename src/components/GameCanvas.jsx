import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from '/src/components/GameScene';


const GameCanvas = () => {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    // scroll slightly to hide search bar
    /* setTimeout(() => {
      window.scrollTo(0, 2000);
    }, 100); */
    
    // ensure game doesn't get covered by UI elements on mobile
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    const phaserGame = buildPhaserGame({
      parent: gameContainerRef.current,
    });

    document.body.style.overflow = 'auto';
    document.body.style.height = '100vh';

    setTimeout(() => {
      window.scrollTo(0, 1);
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    }, 100);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);

      phaserGame.destroy(true);
    };
  }, []);

     return (
        <div id="game-container">
          <div
            ref={gameContainerRef}
            style={{ 
              width: '100%', 
              height: '100%', 
            }}
          />
        </div>
    );
};

export default GameCanvas;
