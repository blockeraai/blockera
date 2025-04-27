import { getSortedObject } from '..';

describe('Testing getSortedObject helper', () => {
	it('should sort object by priority property', () => {
		const unsortedObject = {
			item1: { priority: 2 },
			item2: { priority: 1 },
			item3: { priority: 3 },
		};

		const sortedObject = {
			item2: { priority: 1 },
			item1: { priority: 2 },
			item3: { priority: 3 },
		};

		expect(getSortedObject(unsortedObject)).toEqual(sortedObject);
	});

	it('should handle objects with missing priority property', () => {
		const unsortedObject = {
			item1: { priority: 2 },
			item2: {},
			item3: { priority: 1 },
		};

		const sortedObject = {
			item2: {}, // defaults to priority 0
			item3: { priority: 1 },
			item1: { priority: 2 },
		};

		expect(getSortedObject(unsortedObject)).toEqual(sortedObject);
	});

	it('should handle empty objects', () => {
		const emptyObject = {};
		expect(getSortedObject(emptyObject)).toEqual({});
	});

	it('should maintain object structure while sorting', () => {
		const unsortedObject = {
			item1: { priority: 2, data: 'test1' },
			item2: { priority: 1, data: 'test2' },
			item3: { priority: 3, data: 'test3' },
		};

		const sortedObject = {
			item2: { priority: 1, data: 'test2' },
			item1: { priority: 2, data: 'test1' },
			item3: { priority: 3, data: 'test3' },
		};

		expect(getSortedObject(unsortedObject)).toEqual(sortedObject);
	});

	it('should handle objects with same priority values', () => {
		const unsortedObject = {
			item1: { priority: 1 },
			item2: { priority: 1 },
			item3: { priority: 1 },
		};

		// Should maintain same order for equal priorities
		expect(getSortedObject(unsortedObject)).toEqual(unsortedObject);
	});
});
