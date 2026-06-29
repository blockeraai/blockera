import {
	getNewIdDetails,
	resolveAddedRepeaterItemId,
	shouldRenameRepeaterItemByType,
} from '../utils';

describe('generatedDetailsId() function testing ...', () => {
	it('should generated details for new id when action value include type property', () => {
		expect(
			getNewIdDetails(
				{
					control1: {
						name: 'control1',
						value: {
							'simple-0': { type: 'simple', order: 0 },
							'simple-1': { type: 'simple', order: 1 },
							'simple-2': { type: 'simple', order: 2 },
							'simple-3': { type: 'simple', order: 3 },
							'simple-4': { type: 'simple', order: 4 },
						},
					},
				},
				{
					controlId: 'control1',
					value: { type: 'complex', order: 2 },
				}
			)
		).toEqual({
			itemsCount: 0,
			uniqueId: 'complex-0',
		});
	});

	it('should generated details for new id when action value not include type property', () => {
		expect(
			getNewIdDetails(
				{
					control1: {
						name: 'control1',
						value: {
							0: { order: 0 },
							1: { order: 1 },
							2: { order: 2 },
							3: { order: 3 },
							4: { order: 4 },
						},
					},
				},
				{
					controlId: 'control1',
					value: { order: 2 },
				}
			)
		).toEqual({
			itemsCount: 5,
			uniqueId: '5',
		});
	});
});

describe('resolveAddedRepeaterItemId()', () => {
	const defaultRepeaterItemValue = { isVisible: true };

	it('prefers slug for custom preset rows so pending popover id matches parent value', () => {
		expect(
			resolveAddedRepeaterItemId({
				itemValue: { slug: 'spacing-3', name: 'Spacing 3' },
				itemsCount: 2,
				repeaterItems: {
					'spacing-1': { slug: 'spacing-1' },
					'spacing-2': { slug: 'spacing-2' },
				},
				defaultRepeaterItemValue,
			})
		).toBe('spacing-3');
	});

	it('falls back to type-count ids for typed repeater rows without slug', () => {
		expect(
			resolveAddedRepeaterItemId({
				itemValue: { type: 'filter' },
				itemsCount: 1,
				repeaterItems: {
					'filter-0': { type: 'filter' },
				},
				defaultRepeaterItemValue,
			})
		).toBe('filter-1');
	});

	it('uses numeric id when no slug or type is available', () => {
		expect(
			resolveAddedRepeaterItemId({
				itemValue: { name: 'Item' },
				itemsCount: 4,
				repeaterItems: {},
				defaultRepeaterItemValue,
			})
		).toBe('4');
	});

	it('uses slug or type from selectable rows', () => {
		expect(
			resolveAddedRepeaterItemId({
				itemValue: { slug: 'custom-var', selectable: true },
				itemsCount: 0,
				repeaterItems: {},
				defaultRepeaterItemValue,
				selectableId: true,
			})
		).toBe('custom-var');
	});
});

describe('shouldRenameRepeaterItemByType() function testing ...', () => {
	it('should return true when type does not match itemId prefix', () => {
		expect(
			shouldRenameRepeaterItemByType('first-0', { type: 'second' })
		).toBe(true);
	});

	it('should return false when type matches itemId prefix', () => {
		expect(
			shouldRenameRepeaterItemByType('first-0', { type: 'first' })
		).toBe(false);
	});

	it('should return false when staticType is provided', () => {
		expect(
			shouldRenameRepeaterItemByType(
				'first-0',
				{ type: 'second' },
				'second'
			)
		).toBe(false);
	});
});
