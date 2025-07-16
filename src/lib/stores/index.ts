// Export all stores
export { playerStore, type Player } from './playerStore';
export { gameStore, type Game, type Player as GamePlayer, type Message } from './gameStore';
export { chatStore, type ChatMessage } from './chatStore';
export { connectionStore, type ConnectionStatus, type ConnectionState } from './connectionStore';

// Legacy exports for backward compatibility (deprecated)
import { playerStore } from './playerStore';
import { gameStore } from './gameStore';
import { chatStore } from './chatStore';

// @deprecated - Use playerStore instead
export const player = playerStore;
// @deprecated - Use gameStore instead  
export const game = gameStore;
// @deprecated - Use chatStore instead
export const messages = chatStore; 