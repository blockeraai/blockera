// @flow
const generateColor = (): number => {
	return Math.round(Math.random() * 360);
};

const getPercent = (value: number): number => {
	return Math.round((Math.random() * (value * 100)) % 100);
};

const getRandomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const hslToHex = (h: number, s: number, l: number): string => {
	h /= 360;
	s /= 100;
	l /= 100;

	let r, g, b;
	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number): number => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	const toHex = (c: number): number | string => {
		const hex = Math.round(c * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const generateColors = (length: number, baseColor: number): Object => {
	const colors: { [key: string]: Object } = {};

	Array.from({ length }, (_: void, i: number): string => {
		if (i === 0) {
			return hslToHex(baseColor, 100, 65);
		}

		if (i < length / 1.4) {
			return hslToHex(
				baseColor - 30 * (1 - 2 * (i % 2)) * (i > 2 ? i / 2 : i),
				100,
				64 - i * (1 - 2 * (i % 2)) * 1.85
			);
		}

		return hslToHex(
			baseColor - 150 * (1 - 2 * (i % 2)),
			100,
			66 - i * (1 - 2 * (i % 2)) * 1.3
		);
	}).forEach((color: string, index: number): void => {
		colors['--c' + index] = {
			color,
		};
	});

	return colors;
};

export const generateGradient = (length: number): Array<string> => {
	// const gradients: { [key: string]: string } = {};
	//
	// Array.from({ length }, (_: void, i: number): string => {
	// 	return `radial-gradient(at ${getPercent(i)}% ${getPercent(
	// 		i * 10
	// 	)}%, var(--c${i}) 0px, transparent ${getRandomNumber(40, 70)}%)`;
	// }).forEach((gradient: string, index: number): void => {
	// 	gradients[index + ''] = gradient;
	// });

	return Array.from({ length }, (_: void, i: number): string => {
		return `radial-gradient(at ${getPercent(i)}% ${getPercent(
			i * 10
		)}%, var(--c${i}) 0px, transparent ${getRandomNumber(40, 70)}%)`;
	});
};

export const getRandomHexColor = (): string => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

export default function generateMeshGradient(length: number): Object {
	const colors = generateColors(length, generateColor());

	const properties = generateGradient(length);

	return { colors, gradient: properties.join(',') };
}
