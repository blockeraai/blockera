// @flow

/**
 * External dependencies
 */
import confetti from 'canvas-confetti';

export const fireConfettiBomb = (particleRatio: number, opts: Object) => {
	const count = 200;
	const defaults = {
		origin: { y: 0.5, x: 0.6 },
	};

	confetti({
		...defaults,
		...opts,
		particleCount: Math.floor(count * particleRatio),
	});
};
