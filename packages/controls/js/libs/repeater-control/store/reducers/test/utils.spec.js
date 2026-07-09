import { getNewIdDetails } from '../utils';

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
