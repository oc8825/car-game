import React, { useEffect, useRef } from 'react';
import { buildPhaserGame } from './GameScene'; // import the buildPhaserGame function

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
            style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'absolute', top: 0, left: 0 }}
        />
    );
};

export default GameCanvas;
