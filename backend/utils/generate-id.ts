import { customAlphabet } from 'nanoid';

const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export default generateId;