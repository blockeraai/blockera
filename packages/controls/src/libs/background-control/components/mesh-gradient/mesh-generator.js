const generateColor = () => {
	return Math.round(Math.random() * 360);
};

const getPercent = (value) => {
	return Math.round((Math.random() * (value * 100)) % 100);
};

const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const hslToHex = (h, s, l) => {
	h /= 360;
	s /= 100;
	l /= 100;

	let r, g, b;
	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
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

	const toHex = (c) => {
		const hex = Math.round(c * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const generateColors = (length, baseColor) => {
	return Array.from({ length }, (_, i) => {
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
	});
};

const generateGradient = (length) => {
	return Array.from({ length }, (_, i) => {
		return `radial-gradient(at ${getPercent(i)}% ${getPercent(
			i * 10
		)}%, var(--c${i}) 0px, transparent ${getRandomNumber(40, 70)}%)`;
	});
};

export default function generateMeshGradient(length) {
	const colors = generateColors(length, generateColor());

	const proprieties = generateGradient(length);

	return { colors, gradient: proprieties.join(',') };
}
