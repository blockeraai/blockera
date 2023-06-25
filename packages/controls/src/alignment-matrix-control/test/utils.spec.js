import { convertAlignmentMatrixCoordinates } from '../utils';

describe('Util functions', () => {
	describe('convertAlignmentMatrixCoordinates String', () => {
		test('center', () => {
			expect(convertAlignmentMatrixCoordinates('center')).toMatchObject({
				calculated: true,
				compact: 'center center',
				top: { number: '50%', text: 'center' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('top', () => {
			expect(convertAlignmentMatrixCoordinates('top')).toMatchObject({
				calculated: true,
				compact: 'top center',
				top: { number: '0%', text: 'top' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('bottom', () => {
			expect(convertAlignmentMatrixCoordinates('bottom')).toMatchObject({
				calculated: true,
				compact: 'bottom center',
				top: { number: '100%', text: 'bottom' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('left', () => {
			expect(convertAlignmentMatrixCoordinates('left')).toMatchObject({
				calculated: true,
				compact: 'center left',
				top: { number: '50%', text: 'center' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('right', () => {
			expect(convertAlignmentMatrixCoordinates('right')).toMatchObject({
				calculated: true,
				compact: 'center right',
				top: { number: '50%', text: 'center' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('top left', () => {
			expect(convertAlignmentMatrixCoordinates('top left')).toMatchObject(
				{
					calculated: true,
					compact: 'top left',
					top: { number: '0%', text: 'top' },
					left: { number: '0%', text: 'left' },
				}
			);
		});

		test('top center', () => {
			expect(
				convertAlignmentMatrixCoordinates('top center')
			).toMatchObject({
				calculated: true,
				compact: 'top center',
				top: { number: '0%', text: 'top' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('top right', () => {
			expect(
				convertAlignmentMatrixCoordinates('top right')
			).toMatchObject({
				calculated: true,
				compact: 'top right',
				top: { number: '0%', text: 'top' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('center left', () => {
			expect(
				convertAlignmentMatrixCoordinates('center left')
			).toMatchObject({
				calculated: true,
				compact: 'center left',
				top: { number: '50%', text: 'center' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('center center', () => {
			expect(
				convertAlignmentMatrixCoordinates('center center')
			).toMatchObject({
				calculated: true,
				compact: 'center center',
				top: { number: '50%', text: 'center' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('center right', () => {
			expect(
				convertAlignmentMatrixCoordinates('center right')
			).toMatchObject({
				calculated: true,
				compact: 'center right',
				top: { number: '50%', text: 'center' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('bottom left', () => {
			expect(
				convertAlignmentMatrixCoordinates('bottom left')
			).toMatchObject({
				calculated: true,
				compact: 'bottom left',
				top: { number: '100%', text: 'bottom' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('bottom center', () => {
			expect(
				convertAlignmentMatrixCoordinates('bottom center')
			).toMatchObject({
				calculated: true,
				compact: 'bottom center',
				top: { number: '100%', text: 'bottom' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('bottom right', () => {
			expect(
				convertAlignmentMatrixCoordinates('bottom right')
			).toMatchObject({
				calculated: true,
				compact: 'bottom right',
				top: { number: '100%', text: 'bottom' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('wrong 1 coordinate', () => {
			expect(convertAlignmentMatrixCoordinates('wrong')).toMatchObject({
				calculated: false,
				compact: '',
				top: { number: '', text: '' },
				left: { number: '', text: '' },
			});
		});

		test('wrong 2 coordinate', () => {
			expect(
				convertAlignmentMatrixCoordinates('wrong wrong')
			).toMatchObject({
				calculated: true,
				compact: 'center center',
				top: { number: '50%', text: 'center' },
				left: { number: '50%', text: 'center' },
			});
		});
	});

	describe('convertAlignmentMatrixCoordinates Object', () => {
		test('invalid object', () => {
			expect(
				convertAlignmentMatrixCoordinates({ name: 'akbar' })
			).toMatchObject({
				calculated: false,
				compact: '',
				top: { number: '', text: '' },
				left: { number: '', text: '' },
			});
		});

		test('false', () => {
			expect(convertAlignmentMatrixCoordinates(false)).toMatchObject({
				calculated: false,
				compact: '',
				top: { number: '', text: '' },
				left: { number: '', text: '' },
			});
		});

		test('array', () => {
			expect(convertAlignmentMatrixCoordinates([])).toMatchObject({
				calculated: false,
				compact: '',
				top: { number: '', text: '' },
				left: { number: '', text: '' },
			});
		});

		test('top: 0% left: 0%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '0%', left: '0%' })
			).toMatchObject({
				calculated: true,
				compact: 'top left',
				top: { number: '0%', text: 'top' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('top: 0 left: 0', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '0', left: '0' })
			).toMatchObject({
				calculated: true,
				compact: 'top left',
				top: { number: '0%', text: 'top' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('top: 0% left: 50%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '0%', left: '50%' })
			).toMatchObject({
				calculated: true,
				compact: 'top center',
				top: { number: '0%', text: 'top' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('top: 0 left: 50', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '0', left: '50' })
			).toMatchObject({
				calculated: true,
				compact: 'top center',
				top: { number: '0%', text: 'top' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('top: 0% left: 100%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '0%', left: '100%' })
			).toMatchObject({
				calculated: true,
				compact: 'top right',
				top: { number: '0%', text: 'top' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('top: 0 left: 100', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '0', left: '100' })
			).toMatchObject({
				calculated: true,
				compact: 'top right',
				top: { number: '0%', text: 'top' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('top: 50% left: 0%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '50%', left: '0%' })
			).toMatchObject({
				calculated: true,
				compact: 'center left',
				top: { number: '50%', text: 'center' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('top: 50 left: 0', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '50', left: '0' })
			).toMatchObject({
				calculated: true,
				compact: 'center left',
				top: { number: '50%', text: 'center' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('top: 50% left: 100%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '50%', left: '100%' })
			).toMatchObject({
				calculated: true,
				compact: 'center right',
				top: { number: '50%', text: 'center' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('top: 50 left: 100', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '50', left: '100' })
			).toMatchObject({
				calculated: true,
				compact: 'center right',
				top: { number: '50%', text: 'center' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('top: 100% left: 0%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '100%', left: '0%' })
			).toMatchObject({
				calculated: true,
				compact: 'bottom left',
				top: { number: '100%', text: 'bottom' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('top: 100 left: 0', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '100', left: '0' })
			).toMatchObject({
				calculated: true,
				compact: 'bottom left',
				top: { number: '100%', text: 'bottom' },
				left: { number: '0%', text: 'left' },
			});
		});

		test('top: 100% left: 50%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '100%', left: '50%' })
			).toMatchObject({
				calculated: true,
				compact: 'bottom center',
				top: { number: '100%', text: 'bottom' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('top: 100 left: 50', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '100', left: '50' })
			).toMatchObject({
				calculated: true,
				compact: 'bottom center',
				top: { number: '100%', text: 'bottom' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('top: 100% left: 100%', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '100%', left: '100%' })
			).toMatchObject({
				calculated: true,
				compact: 'bottom right',
				top: { number: '100%', text: 'bottom' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('top: 100 left: 100', () => {
			expect(
				convertAlignmentMatrixCoordinates({ top: '100', left: '100' })
			).toMatchObject({
				calculated: true,
				compact: 'bottom right',
				top: { number: '100%', text: 'bottom' },
				left: { number: '100%', text: 'right' },
			});
		});

		test('wrong value', () => {
			expect(
				convertAlignmentMatrixCoordinates({
					top: 'akbar',
					left: 'akbar',
				})
			).toMatchObject({
				calculated: false,
				compact: '',
				top: { number: '', text: '' },
				left: { number: '', text: '' },
			});
		});

		test('wrong value', () => {
			expect(
				convertAlignmentMatrixCoordinates({
					top: '50%',
					left: 'akbar',
				})
			).toMatchObject({
				calculated: true,
				compact: 'center center',
				top: { number: '50%', text: 'center' },
				left: { number: '50%', text: 'center' },
			});
		});

		test('wrong value', () => {
			expect(
				convertAlignmentMatrixCoordinates({
					top: 'akbar',
					left: '0%',
				})
			).toMatchObject({
				calculated: true,
				compact: 'center left',
				top: { number: '50%', text: 'center' },
				left: { number: '0%', text: 'left' },
			});
		});
	});
});
