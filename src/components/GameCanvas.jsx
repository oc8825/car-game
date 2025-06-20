import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from '/src/components/GameScene';


const GameCanvas = () => {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 100);
    
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
