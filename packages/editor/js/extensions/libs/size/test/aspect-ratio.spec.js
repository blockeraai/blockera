import {
	detectWPAspectRatioValue,
	coreWPAspectRatioValues,
	convertAspectRatioValueToWP,
} from '../compatibility/aspect-ratio';

describe('detectWPAspectRatioValue', () => {
	test('empty', () => {
		expect(detectWPAspectRatioValue('')).toEqual({
			val: '',
			width: '',
			height: '',
		});
	});

	test('auto means original in Blockera', () => {
		expect(detectWPAspectRatioValue('auto')).toEqual({
			val: '',
			width: '',
			height: '',
		});
	});

	test('WP core values', () => {
		coreWPAspectRatioValues.forEach((item) => {
			expect(detectWPAspectRatioValue(item)).toEqual({
				val: item,
				width: '',
				height: '',
			});
		});
	});

	test('custom value - both width and height', () => {
		expect(detectWPAspectRatioValue('1/5')).toEqual({
			val: 'custom',
			width: '1',
			height: '5',
		});
	});

	test('custom value - only one dimension', () => {
		expect(detectWPAspectRatioValue('10')).toEqual({
			val: 'custom',
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
					val: item,
					width: '',
					height: '',
				})
			).toEqual(item);
		});
	});

	test('custom value - both width and height', () => {
		expect(
			convertAspectRatioValueToWP({
				val: 'custom',
				width: '1',
				height: '5',
			})
		).toEqual('1/5');
	});

	test('custom value - only one dimension', () => {
		expect(
			convertAspectRatioValueToWP({
				val: 'custom',
				width: '10',
				height: '10',
			})
		).toEqual('10');
	});
});
