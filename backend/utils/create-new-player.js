// utils/create-new-player.js

import Player from '../schemas/Player.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new player and saves it to the database.
 * @param {Object} playerData - The data for the new player.
 * @param {string} playerData.nickName - The nickname of the player.
 * @param {boolean} playerData.isPartyLeader - Whether the player is the party leader.
 * @returns {Promise<Object>} The saved player object.
 */
const createNewPlayer = async (playerData) => {
    try {
        // Create a new Player instance
        const player = new Player({
            nickName: playerData.nickName,
            isPartyLeader: playerData.isPartyLeader,
            playerId: uuidv4(),
            socketId: playerData.socketId,
            WPM: -1,
            score: 0,
            currentWordIndex: 0,
            // Add other fields as necessary
        });

        // Save the player to the database
        const savedPlayer = await player.save();
        console.log('Player created:', savedPlayer);

        return savedPlayer;
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
};

export default createNewPlayer;