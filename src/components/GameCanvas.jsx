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

    let refreshTimeout = null;

    const updateAndRefresh = () => {
      const newHeight = window.innerHeight;
      const dvh = newHeight * 0.01;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);

      if (phaserGameRef.current && Math.abs(newHeight - prevHeight.current) > 50) {
        prevHeight.current = newHeight;

        // Delay refresh slighty so dimensions have updated correctly
        if (refreshTimeout) clearTimeout(refreshTimeout);

        refreshTimeout = setTimeout(() => {
          console.log('Calling scale.refresh() after debounce', newHeight);
          phaserGameRef.current.scale.refresh();
        }, 200);
      }
    };

    updateViewport();

    // Delay game build, then attach listeners
    requestAnimationFrame(() => {
      phaserGameRef.current = buildPhaserGame({
        parent: gameContainerRef.current,
      });

      // Attach resize listeners after game is built
      window.addEventListener('resize', updateAndRefresh);
      window.addEventListener('orientationchange', updateAndRefresh);
    });

    /* OLD:
    // Delay game build, then attach listeners
    setTimeout(() => {
      phaserGameRef.current = buildPhaserGame({
        parent: gameContainerRef.current,
      });

      window.addEventListener('resize', updateAndRefresh);
      window.addEventListener('orientationchange', updateAndRefresh);
    }, 100);
    */

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
