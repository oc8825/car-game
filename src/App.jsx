import React from 'react';
import GameCanvas from './components/GameCanvas.jsx'; // Import the GameCanvas component

const App = () => {
    return (
        <div>
            <h1>My Phaser + React Game</h1>
            <GameCanvas /> {/* Add the GameCanvas component here */}
        </div>
    );
};

export default App;