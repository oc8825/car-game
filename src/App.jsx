import React from 'react';
import GameCanvas from '/src/components/GameCanvas.jsx'; 

const App = () => {
    return (
        <div>
            <h1>Car Game!</h1>
            <GameCanvas /> {/* Add the GameCanvas component here */}
        </div>
    );
};

export default App;