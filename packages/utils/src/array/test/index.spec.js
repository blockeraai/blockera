import { arraySortItems, toObject } from '../index';

describe('Array Utils', function () {
	it('should sort zero item to first', function () {
		const args = [{ x: 1 }, { x: 2 }, { x: 3 }];

		expect(
			arraySortItems({
				args,
				fromIndex: 0,
				toIndex: 1,
			})
		).toEqual([{ x: 2 }, { x: 1 }, { x: 3 }]);
	});

	it('should convert array of object to one object', function () {
		const arr = [{ x: 1 }, { y: 2 }, { z: 3 }];

		expect(toObject(arr)).toEqual({ x: 1, y: 2, z: 3 });
	});
});
