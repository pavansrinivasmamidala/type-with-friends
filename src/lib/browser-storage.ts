// Utility functions for browser storage
export const browserStorage = {
  // Store player data
  setPlayer: (playerData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('typeWithFriends_player', JSON.stringify(playerData));
    }
  },

  // Get stored player data
  getPlayer: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typeWithFriends_player');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  // Update specific field in stored player data
  updatePlayerField: (field: string, value: any) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typeWithFriends_player');
      if (stored) {
        const playerData = JSON.parse(stored);
        playerData[field] = value;
        localStorage.setItem('typeWithFriends_player', JSON.stringify(playerData));
        return playerData;
      }
    }
    return null;
  },

  // Clear stored player data
  clearPlayer: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('typeWithFriends_player');
    }
  },

  // Check if player exists in storage
  hasPlayer: () => {
    return browserStorage.getPlayer() !== null;
  }
}; 