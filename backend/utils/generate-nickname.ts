// Array of adjectives for generating random nicknames
const adjectives = [
    'Swift', 'Clever', 'Brave', 'Witty', 'Sharp', 'Quick', 'Smart', 'Bright',
    'Fast', 'Agile', 'Nimble', 'Alert', 'Eager', 'Bold', 'Calm', 'Cool',
    'Daring', 'Energetic', 'Fierce', 'Gentle', 'Happy', 'Jolly', 'Kind',
    'Lively', 'Merry', 'Peaceful', 'Proud', 'Quiet', 'Radiant', 'Serene',
    'Tender', 'Vibrant', 'Warm', 'Zealous', 'Ambitious', 'Creative', 'Dynamic',
    'Enthusiastic', 'Friendly', 'Generous', 'Honest', 'Innovative', 'Joyful',
    'Knowledgeable', 'Loyal', 'Motivated', 'Optimistic', 'Patient', 'Reliable'
  ];
  
  // Array of nouns for generating random nicknames
  const nouns = [
    'Typer', 'Coder', 'Writer', 'Player', 'Gamer', 'Speedster', 'Racer',
    'Champion', 'Hero', 'Warrior', 'Ninja', 'Master', 'Pro', 'Expert',
    'Ace', 'Star', 'Legend', 'Veteran', 'Rookie', 'Novice', 'Beginner',
    'Wizard', 'Mage', 'Knight', 'Archer', 'Swordsman', 'Fighter', 'Guardian',
    'Protector', 'Defender', 'Scout', 'Ranger', 'Hunter', 'Tracker', 'Seeker',
    'Explorer', 'Adventurer', 'Traveler', 'Wanderer', 'Pioneer', 'Trailblazer',
    'Navigator', 'Captain', 'Commander', 'Leader', 'Chief', 'Boss', 'Director',
    'Manager', 'Supervisor', 'Coordinator', 'Organizer', 'Planner', 'Strategist'
  ];
  
  /**
   * Generates a random nickname by combining an adjective and noun
   * @returns {string} A random nickname
   */
  export const generateRandomNickname = (): string => {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${randomAdjective}${randomNoun}`;
  };
  
  /**
   * Generates a unique nickname by adding a random number if needed
   * @param {string[]} existingNicknames - Array of existing nicknames to check against
   * @returns {string} A unique random nickname
   */
  export const generateUniqueNickname = (existingNicknames: string[] = []): string => {
    let nickname = generateRandomNickname();

    console.log('nickname inside generateUniqueNickname', nickname);
    
    // If nickname already exists, add a random number
    if (existingNicknames.includes(nickname)) {
      const randomNumber = Math.floor(Math.random() * 999) + 1;
      nickname = `${nickname}${randomNumber}`;
    }
    
    return nickname;
  };