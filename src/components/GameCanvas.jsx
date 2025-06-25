import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from '/src/components/GameScene';

const GameCanvas = () => {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);
  const prevHeight = useRef(window.innerHeight);

  useEffect(() => {
    const updateViewport = () => {
      const dvh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);
    };

    const updateAndRefresh = () => {
      const newHeight = window.innerHeight;
      updateViewport();

      if (phaserGameRef.current && Math.abs(newHeight - prevHeight.current) > 50) {
        prevHeight.current = newHeight;
        console.log('Calling scale.refresh()', newHeight);
        phaserGameRef.current.scale.refresh();
      }
    };

    // Set initial dvh
    updateViewport();

    // Delay game build, then attach listeners
    setTimeout(() => {
      phaserGameRef.current = buildPhaserGame({
        parent: gameContainerRef.current,
      });

      // Only attach resize/orientation listeners AFTER game is built
      window.addEventListener('resize', updateAndRefresh);
      window.addEventListener('orientationchange', updateAndRefresh);
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateAndRefresh);
      window.removeEventListener('orientationchange', updateAndRefresh);

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
          height: 'calc(var(--dvh, 1dvh) * 100)',
        }}
      />
    </div>
  );
};

export default GameCanvas;

/*import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from '/src/components/GameScene';

const GameCanvas = () => {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);
  const prevHeight = useRef(window.innerHeight);

  useEffect(() => {    
    const updateViewportAndRefresh = () => {
      const newHeight = window.innerHeight;
      const dvh = newHeight * 0.01;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);

      // refresh if changed height
      if (phaserGameRef.current && Math.abs(newHeight - prevHeight.current) > 50) {
        prevHeight.current = newHeight;
        console.log('Calling scale.refresh()', newHeight);
        phaserGameRef.current.scale.refresh();
      }
    };

    // initial dvh
    const initialDvh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dvh', `${initialDvh}px`);

    // delay build slightly so dvh properly set
    setTimeout(() => {
      phaserGameRef.current = buildPhaserGame({
        parent: gameContainerRef.current,
      });
    }, 100);

    window.addEventListener('resize', updateViewportAndRefresh);
    window.addEventListener('orientationchange', updateViewportAndRefresh);

    return () => {
      window.removeEventListener('resize', updateViewportAndRefresh);
      window.removeEventListener('orientationchange', updateViewportAndRefresh);

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
              height: 'calc(var(--dvh, 1dvh) * 100)', 
            }}
          />
        </div>
    );
};

export default GameCanvas; */
