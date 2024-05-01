import { getSpacingValue } from '../utils/get-spacing-value';

describe('Should testing spacing value APIs', function () {
	it('should compatible with WordPress preset variables to detect just number of preset!', function () {
		const presetValue = 'var:preset|spacing|60';

		expect(
			getSpacingValue({
				spacing: {
					margin: {
						top: presetValue,
						bottom: presetValue,
					},
				},
				defaultValue: {
					top: '',
					bottom: '',
				},
				propId: 'margin',
			})
		).toEqual({
			top: '60px',
			left: '',
			right: '',
			bottom: '60px',
		});
	});

	it('should compatible with WordPress value with px unit!', function () {
		const presetValue = '60px';

		expect(
			getSpacingValue({
				spacing: {
					margin: {
						top: presetValue,
						bottom: presetValue,
					},
				},
				defaultValue: {
					top: '',
					bottom: '',
				},
				propId: 'margin',
			})
		).toEqual({
			top: '60px',
			left: '',
			right: '',
			bottom: '60px',
		});
	});

	it('should compatible with WordPress value with em unit!', function () {
		const presetValue = '60em';

		expect(
			getSpacingValue({
				spacing: {
					margin: {
						top: presetValue,
						bottom: presetValue,
					},
				},
				defaultValue: {
					top: '',
					bottom: '',
				},
				propId: 'margin',
			})
		).toEqual({
			top: '60em',
			left: '',
			right: '',
			bottom: '60em',
		});
	});
});
