import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from '/src/components/GameScene';


const GameCanvas = () => {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {    
    // ensure game doesn't get covered by UI elements on mobile
    const setViewportHeight = () => {
      const dvh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);
    };
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    // delay build slightly so dvh properly set
    setTimeout(() => {
      phaserGameRef.current = buildPhaserGame({
        parent: gameContainerRef.current,
      });
    }, 50);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);

      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }
    };
  }, []);

     return (
        <div id="game-container">
          <div
            ref={gameContainerRef}
            style={{ 
              width: '100dvw', 
              height: '100dvh', 
            }}
          />
        </div>
    );
};

export default GameCanvas;
