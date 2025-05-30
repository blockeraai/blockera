const hyphensPatterns = [
	`if (parts.length !== {{COUNT}}) {
		return false;
	}`,
	`if ({{COUNT}} !== parts.length) {
		return false;
	}`,
];

module.exports = hyphensPatterns;
