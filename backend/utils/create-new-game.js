
import { v4 as uuidv4 } from 'uuid';
import Game from '../schemas/Game.js';
 const createNewGame = async () => {
    try {
        // Generate a unique gameId, e.g., using UUID
        const gameId = uuidv4(); // Ensure you have uuid installed and imported

        // Create a new game instance with explicit initialization
        const newGame = new Game({
            gameId: gameId, // Required field
            playerIds: [], // Initialize with an empty array
            words: [], // Initialize with any default words if needed
            isOpen: true, // Default value
            isOver: false, // Default value
            startTime: new Date() // Set to current date and time
        });
        return newGame;
    } catch (error) {
        console.error('Error creating new game:', error);
    }
};

export default createNewGame;