import Player, { IPlayer } from '../schemas/Player';
import { v4 as uuidv4 } from 'uuid';
import { generateUniqueNickname } from './generate-nickname';

interface PlayerData {
	nickName: string;
	isPartyLeader: boolean;
	socketId: string;
}

/**
 * Creates a new player and saves it to the database.
 * @param {PlayerData} playerData - The data for the new player.
 * @returns {Promise<Player>}
 */
const createNewPlayer = async (playerData: PlayerData): Promise<IPlayer> => {
	try {
		const existingPlayers = await Player.find({}, 'nickName');
		const existingNicknames = existingPlayers
			.map((player) => player.nickName)
			.filter((nickname): nickname is string => nickname !== undefined);
		console.log('existingNicknames', existingNicknames);

    
		// Create a new Player instance
		const player = new Player({
			nickName: generateUniqueNickname(existingNicknames),
			isPartyLeader: playerData.isPartyLeader,
			playerId: uuidv4(),
			socketId: playerData.socketId,
			WPM: -1,
			score: 0,
			currentWordIndex: 0
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
