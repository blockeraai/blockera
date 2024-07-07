import {
	boxPositionControlDefaultValue,
	boxSpacingValueCleanup,
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
