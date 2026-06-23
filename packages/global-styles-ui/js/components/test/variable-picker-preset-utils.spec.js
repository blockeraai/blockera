import {
	applyVariablePickerRepeaterSelection,
	shouldClearVariablePickerFeatureOnRowDelete,
	variablePickerRowMatchesSelected,
} from '../variable-picker-preset-utils';

const customFontSizeRow = {
	slug: 'my-size',
	name: 'My Size',
	size: '18px',
};

const selectedValueAddon = {
	valueType: 'variable',
	settings: {
		id: 'my-size',
		type: 'font-size',
		reference: { type: 'custom' },
	},
};

describe('variablePickerRowMatchesSelected', () => {
	it('returns true when row slug, type, and reference match the picker value', () => {
		expect(
			variablePickerRowMatchesSelected(
				customFontSizeRow,
				'font-size',
				'custom',
				selectedValueAddon
			)
		).toBe(true);
	});

	it('returns false when variable type differs', () => {
		expect(
			variablePickerRowMatchesSelected(
				customFontSizeRow,
				'spacing',
				'custom',
				selectedValueAddon
			)
		).toBe(false);
	});

	it('returns false when slug differs', () => {
		expect(
			variablePickerRowMatchesSelected(
				{ ...customFontSizeRow, slug: 'other-size' },
				'font-size',
				'custom',
				selectedValueAddon
			)
		).toBe(false);
	});
});

describe('shouldClearVariablePickerFeatureOnRowDelete', () => {
	it('returns true for the active value-addon row', () => {
		expect(
			shouldClearVariablePickerFeatureOnRowDelete(customFontSizeRow, {
				variableType: 'font-size',
				origin: 'custom',
				pickerValue: selectedValueAddon,
			})
		).toBe(true);
	});

	it('returns true when the row matches a plain theme.json preset slug', () => {
		expect(
			shouldClearVariablePickerFeatureOnRowDelete(customFontSizeRow, {
				variableType: 'font-size',
				origin: 'custom',
				pickerValue: null,
				themeJsonPlainPresetSlug: 'my-size',
			})
		).toBe(true);
	});

	it('returns false for a different row while another variable is active', () => {
		expect(
			shouldClearVariablePickerFeatureOnRowDelete(
				{ ...customFontSizeRow, slug: 'other-size' },
				{
					variableType: 'font-size',
					origin: 'custom',
					pickerValue: selectedValueAddon,
				}
			)
		).toBe(false);
	});
});

describe('applyVariablePickerRepeaterSelection', () => {
	it('marks only the active row as selected in the variable picker', () => {
		const items = {
			'row-a': { ...customFontSizeRow, slug: 'row-a' },
			'row-b': { ...customFontSizeRow, slug: 'my-size' },
		};

		const result = applyVariablePickerRepeaterSelection(items, {
			variableType: 'font-size',
			origin: 'custom',
			pickerValue: selectedValueAddon,
		});

		expect(result['row-a'].isSelected).toBe(false);
		expect(result['row-b'].isSelected).toBe(true);
		expect(result['row-a'].selectable).toBe(true);
	});
});
