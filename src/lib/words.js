// @ts-nocheck

const words = [
	'the',
	'be',
	'of',
	'and',
	'a',
	'to',
	'in',
	'he',
	'have',
	'it',
	'that',
	'for',
	'they',
	'I',
	'with',
	'as',
	'not',
	'on',
	'she',
	'at',
	'by',
	'this',
	'we',
	// 'you',
	// 'do',
	// 'but',
	// 'from',
	// 'or',
	// 'which',
	'one',
	'would',
	'more',
	'if',
	'no',
	'man',
	'into',
	'could',
	'state',
	'only',
	'new',
	'year',
	'some',
	'take',
	'come',
	'these',
	'know',
	'see',
	'use',
	'get',
	'like',
	'then',
	'first',
	'any',
	'work',
	'now',
	// 'such',
	// 'give',
	// 'over',
	'think'
];

function shuffle(words) {
	return words.sort(() => Math.random() - 0.5);
}

export default shuffle(words);
