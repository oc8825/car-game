import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from '/src/components/GameScene';

const GameCanvas = () => {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const phaserGame = buildPhaserGame({
      parent: gameContainerRef.current,
    });

    return () => {
      phaserGame.destroy(true);
    };
  }, []);

     return (
        <div
            ref={gameContainerRef}
            style={{ width: '100vw', height: '100vh', 
              overflow: 'hidden', 
              position: 'absolute', top: 0, left: 0,
            margin: 0}}
        />
    );
};

export default GameCanvas;
