import {
	minHeightFromWPCompatibility,
	minHeightToWPCompatibility,
} from '../compatibility/min-height';

describe('minHeightFromWPCompatibility', () => {
	describe('core/group', () => {
		test('imports from style.dimensions.minHeight in block inspector', () => {
			const attributes = {
				blockeraMinHeight: {
					value: '',
				},
				style: {
					dimensions: {
						minHeight: '300px',
					},
				},
			};

			const result = minHeightFromWPCompatibility({
				attributes,
				blockId: 'core/group',
				insideBlockInspector: true,
			});

			expect(result.blockeraMinHeight).toEqual({
				value: '300px',
			});
		});

		test('imports from dimensions.minHeight in global styles', () => {
			const attributes = {
				blockeraMinHeight: {
					value: '',
				},
				dimensions: {
					minHeight: '300px',
				},
			};

			const result = minHeightFromWPCompatibility({
				attributes,
				blockId: 'core/group',
				insideBlockInspector: false,
			});

			expect(result.blockeraMinHeight).toEqual({
				value: '300px',
			});
		});

		test('skips when blockeraMinHeight already has a value', () => {
			const attributes = {
				blockeraMinHeight: {
					value: '200px',
				},
				style: {
					dimensions: {
						minHeight: '300px',
					},
				},
			};

			const result = minHeightFromWPCompatibility({
				attributes,
				blockId: 'core/group',
				insideBlockInspector: true,
			});

			expect(result.blockeraMinHeight).toEqual({
				value: '200px',
			});
		});
	});

	describe('core/cover regression', () => {
		test('imports from minHeight and minHeightUnit in block inspector', () => {
			const attributes = {
				blockeraMinHeight: {
					value: '',
				},
				minHeight: 300,
				minHeightUnit: 'px',
			};

			const result = minHeightFromWPCompatibility({
				attributes,
				blockId: 'core/cover',
				insideBlockInspector: true,
			});

			expect(result.blockeraMinHeight).toEqual({
				value: '300px',
			});
		});

		test('imports from dimensions.minHeight in global styles', () => {
			const attributes = {
				blockeraMinHeight: {
					value: '',
				},
				dimensions: {
					minHeight: '300px',
				},
			};

			const result = minHeightFromWPCompatibility({
				attributes,
				blockId: 'core/cover',
				insideBlockInspector: false,
			});

			expect(result.blockeraMinHeight).toEqual({
				value: '300px',
			});
		});
	});
});

describe('minHeightToWPCompatibility', () => {
	describe('core/group', () => {
		test('writes to style.dimensions.minHeight in block inspector', () => {
			const result = minHeightToWPCompatibility({
				newValue: '400px',
				blockId: 'core/group',
				insideBlockInspector: true,
			});

			expect(result).toEqual({
				style: {
					dimensions: {
						minHeight: '400px',
					},
				},
			});
		});

		test('writes to dimensions.minHeight in global styles', () => {
			const result = minHeightToWPCompatibility({
				newValue: '400px',
				blockId: 'core/group',
				insideBlockInspector: false,
			});

			expect(result).toEqual({
				dimensions: {
					minHeight: '400px',
				},
			});
		});

		test('clears style.dimensions.minHeight on empty value in block inspector', () => {
			const result = minHeightToWPCompatibility({
				newValue: '',
				blockId: 'core/group',
				insideBlockInspector: true,
			});

			expect(result).toEqual({
				style: {
					dimensions: {
						minHeight: undefined,
					},
				},
			});
		});

		test('clears dimensions.minHeight on reset in global styles', () => {
			const result = minHeightToWPCompatibility({
				newValue: '400px',
				blockId: 'core/group',
				insideBlockInspector: false,
				ref: {
					current: {
						action: 'reset',
					},
				},
			});

			expect(result).toEqual({
				dimensions: {
					minHeight: undefined,
				},
			});
		});
	});

	describe('core/cover regression', () => {
		test('writes minHeight and minHeightUnit in block inspector', () => {
			const result = minHeightToWPCompatibility({
				newValue: '300px',
				blockId: 'core/cover',
				insideBlockInspector: true,
			});

			expect(result).toEqual({
				minHeight: 300,
				minHeightUnit: 'px',
			});
		});

		test('writes dimensions.minHeight in global styles', () => {
			const result = minHeightToWPCompatibility({
				newValue: '300px',
				blockId: 'core/cover',
				insideBlockInspector: false,
			});

			expect(result).toEqual({
				dimensions: {
					minHeight: '300px',
				},
			});
		});
	});
});
