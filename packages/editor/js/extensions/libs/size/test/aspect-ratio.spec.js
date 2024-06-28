import {
	detectWPAspectRatioValue,
	coreWPAspectRatioValues,
	convertAspectRatioValueToWP,
} from '../compatibility/aspect-ratio';

describe('detectWPAspectRatioValue', () => {
	test('empty', () => {
		expect(detectWPAspectRatioValue('')).toEqual({
			value: '',
			width: '',
			height: '',
		});
	});

	test('auto means original in Blockera', () => {
		expect(detectWPAspectRatioValue('auto')).toEqual({
			value: '',
			width: '',
			height: '',
		});
	});

	test('WP core values', () => {
		coreWPAspectRatioValues.forEach((item) => {
			expect(detectWPAspectRatioValue(item)).toEqual({
				value: item,
				width: '',
				height: '',
			});
		});
	});

	test('custom value - both width and height', () => {
		expect(detectWPAspectRatioValue('1/5')).toEqual({
			value: 'custom',
			width: '1',
			height: '5',
		});
	});

	test('custom value - only one dimension', () => {
		expect(detectWPAspectRatioValue('10')).toEqual({
			value: 'custom',
			width: '10',
			height: '10',
		});
	});
});

describe('convertAspectRatioValueToWP', () => {
	test('empty', () => {
		expect(convertAspectRatioValueToWP('')).toEqual('');
	});

	test('WP core values', () => {
		coreWPAspectRatioValues.forEach((item) => {
			expect(
				convertAspectRatioValueToWP({
					value: item,
					width: '',
					height: '',
				})
			).toEqual(item);
		});
	});

	test('custom value - both width and height', () => {
		expect(
			convertAspectRatioValueToWP({
				value: 'custom',
				width: '1',
				height: '5',
			})
		).toEqual('1/5');
	});

	test('custom value - only one dimension', () => {
		expect(
			convertAspectRatioValueToWP({
				value: 'custom',
				width: '10',
				height: '10',
			})
		).toEqual('10');
	});
});
