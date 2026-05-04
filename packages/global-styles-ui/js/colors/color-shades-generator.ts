/**
 * Generate a Tailwind-style shade ramp from a base color using OKLCH.
 * The base color is preserved EXACTLY at step 500.
 * Lighter shades (50-400) interpolate toward white.
 * Darker shades (600-950) interpolate toward black.
 */

export const COLOR_SHADE_STEPS = [
	50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

/**
 * Ramp step equal to the main swatch (`generateColorShades` anchors here).
 * Not stored as `*-shade-500` in global styles — the main preset is canonical; UI derives this step.
 */
export const COLOR_SHADE_ANCHOR_STEP = 500;

export type ColorShadeStep = (typeof COLOR_SHADE_STEPS)[number];

export type ColorShadesMap = Record<string, string>;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const h = hex.replace('#', '');
	const full =
		h.length === 3
			? h
					.split('')
					.map((c) => c + c)
					.join('')
			: h;
	return {
		r: parseInt(full.slice(0, 2), 16),
		g: parseInt(full.slice(2, 4), 16),
		b: parseInt(full.slice(4, 6), 16),
	};
}

function rgbToHex(r: number, g: number, b: number): string {
	const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
	return (
		'#' +
		[clamp(r), clamp(g), clamp(b)]
			.map((v) => v.toString(16).padStart(2, '0'))
			.join('')
			.toUpperCase()
	);
}

const toLinear = (v: number): number => {
	v /= 255;
	return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const fromLinear = (v: number): number => {
	v = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
	return v * 255;
};

function rgbToOklab(
	r: number,
	g: number,
	b: number
): { L: number; a: number; b: number } {
	const lr = toLinear(r);
	const lg = toLinear(g);
	const lbH = toLinear(b);
	const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lbH;
	const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lbH;
	const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lbH;
	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);
	return {
		L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
		a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
		b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
	};
}

function oklabToRgb(
	L: number,
	a: number,
	b: number
): {
	r: number;
	g: number;
	b: number;
} {
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const l = l_ ** 3;
	const m = m_ ** 3;
	const s = s_ ** 3;
	return {
		r: fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
		g: fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
		b: fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
	};
}

/**
 * @param baseHex - Hex color like "#627398" (with or without #)
 * @return Map of step to hex: { 50: "#...", ..., 500: baseHex, ..., 950: "#..." }
 */
export function generateColorShades(baseHex: string): ColorShadesMap {
	const normalizedBase = baseHex.startsWith('#')
		? baseHex.toUpperCase()
		: `#${baseHex.toUpperCase()}`;

	const { r, g, b } = hexToRgb(normalizedBase);
	const baseLab = rgbToOklab(r, g, b);
	const baseL = baseLab.L;
	const baseA = baseLab.a;
	const baseB = baseLab.b;

	const lightFactors: Record<string, number> = {
		'50': 0.95,
		'100': 0.85,
		'200': 0.7,
		'300': 0.52,
		'400': 0.28,
	};
	const darkFactors: Record<string, number> = {
		'600': 0.18,
		'700': 0.38,
		'800': 0.58,
		'900': 0.76,
		'950': 0.88,
	};

	const chromaFactors: Record<string, number> = {
		'50': 0.3,
		'100': 0.5,
		'200': 0.75,
		'300': 0.9,
		'400': 1.0,
		'500': 1.0,
		'600': 1.0,
		'700': 0.92,
		'800': 0.78,
		'900': 0.6,
		'950': 0.45,
	};

	const shades: ColorShadesMap = {};

	shades['500'] = normalizedBase;

	for (const step of Object.keys(lightFactors)) {
		const t = lightFactors[step];
		const L = baseL + (1.0 - baseL) * t;
		const chromaMul = chromaFactors[step];
		const newA = baseA * chromaMul;
		const newB = baseB * chromaMul;
		const rgb = oklabToRgb(L, newA, newB);
		shades[step] = rgbToHex(rgb.r, rgb.g, rgb.b);
	}

	for (const step of Object.keys(darkFactors)) {
		const t = darkFactors[step];
		const L = baseL * (1.0 - t);
		const chromaMul = chromaFactors[step];
		const newA = baseA * chromaMul;
		const newB = baseB * chromaMul;
		const rgb = oklabToRgb(L, newA, newB);
		shades[step] = rgbToHex(rgb.r, rgb.g, rgb.b);
	}

	return shades;
}
