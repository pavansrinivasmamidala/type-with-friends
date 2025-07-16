import { v4 as uuidv4 } from 'uuid';
import Game, { IGame } from '../schemas/Game'; // Ensure Game schema exports an interface
import generateId from './generate-id';

interface GameData {
  gameId: string;
  playerIds: string[];
  words: string[];
  isOpen: boolean;
  isOver: boolean;
  startTime: Date;
}

const createNewGame = async (): Promise<IGame | undefined> => {
  try {
    // Generate a unique gameId, e.g., using UUID
    const gameId = generateId(); // Ensure you have uuid installed and imported

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