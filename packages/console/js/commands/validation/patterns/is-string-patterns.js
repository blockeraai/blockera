const patterns = [
	`if ('string' !== typeof {{NAME}}) {
		return false;
	}`,
	`if (typeof {{NAME}} !== 'string') {
		return false;
	}`,
];

module.exports = patterns;
