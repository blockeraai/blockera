import { update } from '../index';

describe('update api testing', function () {
	it('should merge array items with new item into parent object', function () {
		const data = {
			x: [{ value: 10 }],
		};

		expect(update(data, 'x', { value: 20 })).toEqual({
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

		expect(update(data, '[0].x[0].y', { 'prop-id': [10, 12] })).toEqual([
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
			update(_data, '[0][0][0][test-prop][0]', { 'prop-id': [10, 12] })
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

	it('should replace value of object by complex query', function () {
		const data = {
			x: [
				{
					y: { 'prop-id': [10] },
				},
			],
		};

		expect(update(data, 'x[0].y', { 'prop-id': [10, 12] }, true)).toEqual({
			x: [
				{
					y: { 'prop-id': [10, 12] },
				},
			],
		});
	});

	it('should replace value of array by complex query', function () {
		const data = [
			{
				x: [
					{
						y: [10, 30],
					},
				],
			},
		];

		expect(update(data, '[0].x[0].y', [10, 12], true)).toEqual([
			{
				x: [
					{
						y: [10, 12],
					},
				],
			},
		]);
	});

	it('should merge value of object by complex query', function () {
		const data = [
			{
				x: [
					{
						y: {
							value: 100,
						},
					},
				],
			},
		];

		expect(update(data, '[0].x[0].y', { type: 'simple' })).toEqual([
			{
				x: [
					{
						y: {
							type: 'simple',
							value: 100,
						},
					},
				],
			},
		]);

		expect(
			update(
				[
					{
						x: [
							{
								y: {
									type: 'simple',
									value: 100,
								},
							},
						],
					},
				],
				'[0].x[0].y',
				1000
			)
		).toEqual([
			{
				x: [
					{
						y: {
							type: 'simple',
							value: 1000,
						},
					},
				],
			},
		]);

		expect(
			update(
				[
					{
						x: [
							{
								y: {
									type: 'simple',
									value: 100,
								},
							},
						],
					},
				],
				'[0].x[0].y.type',
				'multi'
			)
		).toEqual([
			{
				x: [
					{
						y: {
							type: 'multi',
							value: 100,
						},
					},
				],
			},
		]);
	});
});
