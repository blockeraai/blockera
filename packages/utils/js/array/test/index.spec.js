import {
	arraySortItems,
	indexOf,
	isEquals,
	toObject,
	arrayDiff,
	difference,
	union,
	without,
} from '../index';

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

	it('should compare two arrays and retrieve false result', function () {
		const arr1 = [{ x: 1 }, { y: 2 }, { z: 3 }];
		const arr2 = [{ x: 1 }, { y: 3 }, { z: 3 }];

		expect(isEquals(arr1, arr2)).toBeFalsy();
	});

	it('should compare two arrays with complex structure and retrieve false result', function () {
		const arr1 = [{ x: 1 }, { y: [{ v: { b: [{ a: 1 }] } }] }, { z: 3 }];
		const arr2 = [{ x: 1 }, { y: [{ v: { b: [{ a: 1.5 }] } }] }, { z: 3 }];

		expect(isEquals(arr1, arr2)).toBeFalsy();
	});

	it('should compare two arrays and retrieve true result', function () {
		const arr1 = [{ x: 1 }, { y: 2 }, { z: 3 }];
		const arr2 = [{ x: 1 }, { y: 2 }, { z: 3 }];

		expect(isEquals(arr1, arr2)).toBeTruthy();
	});

	it('should retrieve correct index of array with case sensitive', function () {
		const arary = ['Block', 'wordpress', 'theMe'];

		expect(indexOf(arary, 'theme'));
	});

	it('should retrieve differences between two recieved array', () => {
		expect(arrayDiff(['normal', 'hover'], ['normal'])).toEqual(['hover']);
	});

	it('should equals same object', () => {
		expect(
			isEquals(
				{
					disabledBlocks: [],
				},
				{
					disabledBlocks: [],
				}
			)
		).toBeTruthy();
	});

	it('should get differences between two arrays', () => {
		expect(difference([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3]);
	});

	it('should get unique array items', () => {
		expect(union([1, 2, 3, 3, 5, 2, 1])).toEqual([1, 2, 3, 5]);
		expect(
			union(
				[1, 2, 3, 3, 5, 2, 1],
				[1, 2, 3, 3, 5, 2, 1, 1, 2, 2, 5, 5, 5, 6, 6, 6, 6]
			)
		).toEqual([1, 2, 3, 5, 6]);
	});

	it('should get without values to remove', () => {
		expect(without([1, 2, 3, 5], [5])).toEqual([1, 2, 3]);
	});
});
