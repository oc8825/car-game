import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from '/src/components/GameScene';

const GameCanvas = () => {
  const gameContainerRef = useRef(null);
  const phaserGameRef = useRef(null);
  const prevHeight = useRef(window.innerHeight);

  useEffect(() => {
    // recalculate dvh
    const updateViewport = () => {
      const dvh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);
    };

    // given a big enough change in viewport, refresh to new dimensions
    let refreshTimeout = null;
    const updateAndRefresh = () => {
      const newHeight = window.innerHeight;
      updateViewport();

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

    // Detect if in lower power mode and set speedFactor accordingly
    const now = new Date().getTime();
    setTimeout(() => {
      // Delay game build and attach listeners after build
      phaserGameRef.current = buildPhaserGame({
        parent: gameContainerRef.current,
      });

      const game = phaserGameRef.current;
      if (game == null) return;
      const actualDuration = new Date().getTime() - now;
      game.config.speedFactor = actualDuration > 1000 ? 2 : 1;

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
