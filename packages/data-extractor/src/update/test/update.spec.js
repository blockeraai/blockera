import { update } from '../index';

describe('update api testing', function () {
	it('should merge array items with new item into parent object', function () {
		const data = {
			x: [{ value: 10 }],
		};

		expect(update(data, 'x', { value: 20 }, 'merge')).toEqual({
			x: [{ value: 10 }, { value: 20 }],
		});
	});

	it('should add new item into array with access by complex query', function () {
		const data = [
			{
				x: [
					{
						y: [{ 'prop-id': [10] }],
					},
				],
			},
		];

		expect(
			update(data, '[0].x[0].y', { 'prop-id': [10, 12] }, 'merge')
		).toEqual([
			{
				x: [
					{
						y: [{ 'prop-id': [10] }, { 'prop-id': [10, 12] }],
					},
				],
			},
		]);

		const _data = [
			[
				[
					{
						'test-prop': [[{ x: 20 }]],
					},
				],
			],
		];

		expect(
			update(
				_data,
				'[0][0][0][test-prop][0]',
				{ 'prop-id': [10, 12] },
				'merge'
			)
		).toEqual([
			[
				[
					{
						'test-prop': [[{ x: 20 }, { 'prop-id': [10, 12] }]],
					},
				],
			],
		]);
	});
});
