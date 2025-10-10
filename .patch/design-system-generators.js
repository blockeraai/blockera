/**
 * Spacing Scale Generator v1
 */

function spacingScale(opts = {}) {
	const { base = 16, count = 16, rounding = 'none', precision = 2 } = opts;

	// Seed multipliers that reproduce your original list:
	const seed = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6];
	const multipliers = seed.slice();

	// Extend with all even integers >= 8 until reaching `count`
	for (let k = 8; multipliers.length < count; k += 2) {
		multipliers.push(k);
	}

	const applyRound = (x) => {
		if (rounding === 'none') return x;
		if (rounding === 'floor') return Math.floor(x);
		if (rounding === 'ceil') return Math.ceil(x);
		// 'round'
		const f = Math.pow(10, precision);
		return Math.round(x * f) / f;
	};

	return multipliers.slice(0, count).map((m) => applyRound(base * m));
}

// Examples:
console.log(spacingScale({ base: 16, count: 16 }));
// -> [4,8,12,16,20,24,32,40,48,64,80,96,128,160,192,224]

console.log(spacingScale({ base: 16, count: 25 }));
// -> continues: 256, 320, 384, 448, 512, 576, 640, 704, 768

console.log(spacingScale({ base: 15, count: 12, rounding: 'ceil' }));
// -> [4,8,12,15,19,23,30,38,45,60,75,90]
