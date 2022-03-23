import { customAlphabet, random } from 'nanoid';

const CHAR_SET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const _customAlphabet = customAlphabet(CHAR_SET, 32);

export function generateString(size = 16) {
	return _customAlphabet(size);
}

export function generateRandomBuffer(size = 16) {
	return random(size);
}
