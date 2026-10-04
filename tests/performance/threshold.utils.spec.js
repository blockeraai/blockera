/**
 * @jest-environment node
 */

const {
	parseThresholdPercent,
	evaluateThreshold,
	formatThresholdLabel,
	formatThresholdDiffCell,
} = require('./utils');

describe('parseThresholdPercent', () => {
	it('parses valid slower/faster object', () => {
		expect(parseThresholdPercent({ slower: 25, faster: 50 }, 'test')).toEqual(
			{
				slower: 25,
				faster: 50,
			}
		);
	});

	it('rejects plain numbers', () => {
		expect(() => parseThresholdPercent(25, 'test')).toThrow(
			'test must be an object with numeric "slower" and "faster" keys'
		);
	});

	it('rejects incomplete objects', () => {
		expect(() => parseThresholdPercent({ slower: 25 }, 'test')).toThrow(
			'test must be an object with numeric "slower" and "faster" keys'
		);
	});
});

describe('evaluateThreshold', () => {
	const thresholds = { slower: 25, faster: 50 };

	it('passes within the pass band', () => {
		expect(evaluateThreshold(0, thresholds)).toEqual({ pass: true });
		expect(evaluateThreshold(25, thresholds)).toEqual({ pass: true });
		expect(evaluateThreshold(-50, thresholds)).toEqual({ pass: true });
	});

	it('fails when slower than the slower limit', () => {
		const result = evaluateThreshold(26, thresholds);
		expect(result.pass).toBe(false);
		expect(result.reason).toBe('+26% exceeds slower limit +25%');
	});

	it('fails when faster than the faster limit', () => {
		const result = evaluateThreshold(-51, thresholds);
		expect(result.pass).toBe(false);
		expect(result.reason).toBe('-51% exceeds faster limit -50%');
	});
});

describe('formatThresholdLabel', () => {
	it('formats faster and slower limits', () => {
		expect(formatThresholdLabel({ slower: 25, faster: 50 })).toBe(
			'-50% / +25%'
		);
	});
});

describe('formatThresholdDiffCell', () => {
	const thresholds = { slower: 25, faster: 50 };

	it('returns plain text when within threshold', () => {
		expect(formatThresholdDiffCell('+10%', 10, thresholds)).toBe('+10%');
	});

	it('wraps slower failures in red styling', () => {
		const result = formatThresholdDiffCell('+30%', 30, thresholds);
		expect(result).toContain('#e60100');
		expect(result).toContain('+30%');
	});

	it('wraps faster failures in green styling', () => {
		const result = formatThresholdDiffCell('-60%', -60, thresholds);
		expect(result).toContain('#00b000');
		expect(result).toContain('-60%');
	});
});
