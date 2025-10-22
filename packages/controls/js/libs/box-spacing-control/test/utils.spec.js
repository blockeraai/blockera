import {
	boxPositionControlDefaultValue,
	boxSpacingValueCleanup,
	getSmartLock,
} from '../utils';

describe('Testing util functions', () => {
	describe('default value testing', () => {
		test('default value is correct', () => {
			expect(boxPositionControlDefaultValue).toEqual({
				margin: {
					top: '',
					right: '',
					bottom: '',
					left: '',
				},
				padding: {
					top: '',
					right: '',
					bottom: '',
					left: '',
				},
			});
		});
	});

	describe('boxSpacingValueCleanup testing', () => {
		test('should return exact default value if default value passed', () => {
			const value = boxSpacingValueCleanup(
				boxPositionControlDefaultValue
			);

			expect(value).toEqual(boxPositionControlDefaultValue);
		});

		test('empty value but not exact as default value', () => {
			let value = boxSpacingValueCleanup({
				margin: {
					top: '',
				},
				padding: {
					top: '',
				},
			});

			expect(value).toEqual(boxPositionControlDefaultValue);

			value = boxSpacingValueCleanup({
				margin: {
					top: '',
					right: '',
				},
				padding: {
					top: '',
					right: '',
					left: '',
				},
			});

			expect(value).toEqual(boxPositionControlDefaultValue);
		});

		test('complex', () => {
			const value = boxSpacingValueCleanup({
				margin: {
					top: '10px',
					right: '',
					bottom: '12px',
					left: '',
				},
				padding: {
					top: '',
					right: '11px',
					bottom: '',
					left: '13px',
				},
			});

			expect(value).toEqual({
				margin: {
					top: '10px',
					bottom: '12px',
				},
				padding: {
					right: '11px',
					left: '13px',
				},
			});
		});

		describe('Margin', () => {
			test('top', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '10px',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				});

				expect(value).toEqual({
					margin: {
						top: '10px',
					},
				});
			});

			test('right', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '10px',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				});

				expect(value).toEqual({
					margin: {
						right: '10px',
					},
				});
			});

			test('bottom', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '',
						bottom: '10px',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				});

				expect(value).toEqual({
					margin: {
						bottom: '10px',
					},
				});
			});

			test('left', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '10px',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				});

				expect(value).toEqual({
					margin: {
						left: '10px',
					},
				});
			});

			test('all', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '10px',
						right: '11px',
						bottom: '12px',
						left: '13px',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				});

				expect(value).toEqual({
					margin: {
						top: '10px',
						right: '11px',
						bottom: '12px',
						left: '13px',
					},
				});
			});
		});

		describe('padding', () => {
			test('top', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '10px',
						right: '',
						bottom: '',
						left: '',
					},
				});

				expect(value).toEqual({
					padding: {
						top: '10px',
					},
				});
			});

			test('right', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '10px',
						bottom: '',
						left: '',
					},
				});

				expect(value).toEqual({
					padding: {
						right: '10px',
					},
				});
			});

			test('bottom', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '10px',
						left: '',
					},
				});

				expect(value).toEqual({
					padding: {
						bottom: '10px',
					},
				});
			});

			test('left', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '10px',
					},
				});

				expect(value).toEqual({
					padding: {
						left: '10px',
					},
				});
			});

			test('all', () => {
				const value = boxSpacingValueCleanup({
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '10px',
						right: '11px',
						bottom: '12px',
						left: '13px',
					},
				});

				expect(value).toEqual({
					padding: {
						top: '10px',
						right: '11px',
						bottom: '12px',
						left: '13px',
					},
				});
			});
		});
	});
});

describe('getSmartLock', () => {
	test('returns empty string when all values are empty', () => {
		const value = {
			padding: { top: '', right: '', bottom: '', left: '' },
			margin: { top: '', right: '', bottom: '', left: '' },
		};
		expect(getSmartLock(value, 'padding')).toBe('');
		expect(getSmartLock(value, 'margin')).toBe('');
	});

	test('returns empty string when only one value is set', () => {
		const value = {
			padding: { top: '10px', right: '', bottom: '', left: '' },
			margin: { top: '', right: '', bottom: '', left: '5px' },
		};
		expect(getSmartLock(value, 'padding')).toBe('');
		expect(getSmartLock(value, 'margin')).toBe('');
	});

	test('returns horizontal when left and right are equal and top/bottom are not', () => {
		const value = {
			padding: { top: '1px', right: '10px', bottom: '2px', left: '10px' },
			margin: { top: '3px', right: '5px', bottom: '4px', left: '5px' },
		};
		expect(getSmartLock(value, 'padding')).toBe('horizontal');
		expect(getSmartLock(value, 'margin')).toBe('horizontal');
	});

	test('returns vertical when top and bottom are equal and left/right are not', () => {
		const value = {
			padding: { top: '10px', right: '1px', bottom: '10px', left: '2px' },
			margin: { top: '5px', right: '3px', bottom: '5px', left: '4px' },
		};
		expect(getSmartLock(value, 'padding')).toBe('vertical');
		expect(getSmartLock(value, 'margin')).toBe('vertical');
	});

	test('returns all when all values are equal and not empty', () => {
		const value = {
			padding: {
				top: '10px',
				right: '10px',
				bottom: '10px',
				left: '10px',
			},
			margin: { top: '5px', right: '5px', bottom: '5px', left: '5px' },
		};
		expect(getSmartLock(value, 'padding')).toBe('all');
		expect(getSmartLock(value, 'margin')).toBe('all');
	});

	test('returns vertical-horizontal when top/bottom are equal, left/right are equal, but top != left', () => {
		const value = {
			padding: {
				top: '10px',
				right: '20px',
				bottom: '10px',
				left: '20px',
			},
			margin: { top: '5px', right: '15px', bottom: '5px', left: '15px' },
		};
		expect(getSmartLock(value, 'padding')).toBe('vertical-horizontal');
		expect(getSmartLock(value, 'margin')).toBe('vertical-horizontal');
	});

	test('returns empty string for mixed/unequal values', () => {
		const value = {
			padding: { top: '1px', right: '2px', bottom: '3px', left: '4px' },
			margin: { top: '5px', right: '6px', bottom: '7px', left: '8px' },
		};
		expect(getSmartLock(value, 'padding')).toBe('');
		expect(getSmartLock(value, 'margin')).toBe('');
	});

	test('returns correct lock when some values are empty', () => {
		const value = {
			padding: {
				top: '10px',
				right: '',
				bottom: '10px',
				left: '',
			},
			margin: { top: '', right: '5px', bottom: '', left: '5px' },
		};
		expect(getSmartLock(value, 'padding')).toBe('vertical');
		expect(getSmartLock(value, 'margin')).toBe('horizontal');
	});
});
