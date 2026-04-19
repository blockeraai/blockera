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

/**
 * Generate a Tailwind-style shade ramp from a base color using OKLCH.
 * The base color is preserved EXACTLY at step 500.
 * Lighter shades (50-400) interpolate toward white.
 * Darker shades (600-950) interpolate toward black.
 *
 * @param {string} baseHex - Hex color like "#627398" (with or without #)
 * @returns {Object} Map of step to hex: { 50: "#...", 100: "#...", ..., 500: baseHex, ..., 950: "#..." }
 */
function generateColorShades(baseHex) {
	// ---------- conversions ----------
	function hexToRgb(hex) {
		hex = hex.replace('#', '');
		if (hex.length === 3)
			hex = hex
				.split('')
				.map((c) => c + c)
				.join('');
		return {
			r: parseInt(hex.slice(0, 2), 16),
			g: parseInt(hex.slice(2, 4), 16),
			b: parseInt(hex.slice(4, 6), 16),
		};
	}

	function rgbToHex(r, g, b) {
		const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
		return (
			'#' +
			[clamp(r), clamp(g), clamp(b)]
				.map((v) => v.toString(16).padStart(2, '0'))
				.join('')
				.toUpperCase()
		);
	}

	const toLinear = (v) => {
		v = v / 255;
		return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	};
	const fromLinear = (v) => {
		v = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
		return v * 255;
	};

	function rgbToOklab(r, g, b) {
		const lr = toLinear(r),
			lg = toLinear(g),
			lb = toLinear(b);
		const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
		const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
		const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
		const l_ = Math.cbrt(l),
			m_ = Math.cbrt(m),
			s_ = Math.cbrt(s);
		return {
			L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
			a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
			b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
		};
	}

	function oklabToRgb(L, a, b) {
		const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
		const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
		const s_ = L - 0.0894841775 * a - 1.291485548 * b;
		const l = l_ ** 3,
			m = m_ ** 3,
			s = s_ ** 3;
		return {
			r: fromLinear(
				4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
			),
			g: fromLinear(
				-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
			),
			b: fromLinear(
				-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
			),
		};
	}

	// ---------- core algorithm ----------
	// 1. Normalize the input to uppercase for consistent output
	const normalizedBase = baseHex.startsWith('#')
		? baseHex.toUpperCase()
		: '#' + baseHex.toUpperCase();

	// 2. Convert base to Oklab to extract its lightness, chroma, and hue
	const { r, g, b } = hexToRgb(normalizedBase);
	const baseLab = rgbToOklab(r, g, b);
	const baseL = baseLab.L;
	const baseA = baseLab.a;
	const baseB = baseLab.b;

	// 3. Target lightness for each step. 500 is always the base color's actual lightness.
	//    Lighter steps interpolate toward white (L = 1.0).
	//    Darker steps interpolate toward black (L = 0.0).
	//    Interpolation factor 0 = base color, 1 = endpoint (white or black).
	const lightFactors = {
		50: 0.95, // nearly white
		100: 0.85,
		200: 0.7,
		300: 0.52,
		400: 0.28,
	};
	const darkFactors = {
		600: 0.18, // just slightly darker than base
		700: 0.38,
		800: 0.58,
		900: 0.76,
		950: 0.88, // nearly black
	};

	// 4. Chroma dampening — reduce saturation at the extremes only.
	//    The base (500) keeps full chroma. Shades near white/black desaturate
	//    because fully-saturated near-white or near-black looks unnatural.
	const chromaFactors = {
		50: 0.3,
		100: 0.5,
		200: 0.75,
		300: 0.9,
		400: 1.0,
		500: 1.0,
		600: 1.0,
		700: 0.92,
		800: 0.78,
		900: 0.6,
		950: 0.45,
	};

	const shades = {};

	// Base color — exact match, no math
	shades[500] = normalizedBase;

	// Lighter shades (50-400): interpolate from base toward white
	for (const step of Object.keys(lightFactors)) {
		const t = lightFactors[step];
		const L = baseL + (1.0 - baseL) * t; // lightness moves toward 1
		const chromaMul = chromaFactors[step];
		const newA = baseA * chromaMul;
		const newB = baseB * chromaMul;
		const rgb = oklabToRgb(L, newA, newB);
		shades[step] = rgbToHex(rgb.r, rgb.g, rgb.b);
	}

	// Darker shades (600-950): interpolate from base toward black
	for (const step of Object.keys(darkFactors)) {
		const t = darkFactors[step];
		const L = baseL * (1.0 - t); // lightness moves toward 0
		const chromaMul = chromaFactors[step];
		const newA = baseA * chromaMul;
		const newB = baseB * chromaMul;
		const rgb = oklabToRgb(L, newA, newB);
		shades[step] = rgbToHex(rgb.r, rgb.g, rgb.b);
	}

	return shades;
}

console.log(generateColorShades('#627398'));
