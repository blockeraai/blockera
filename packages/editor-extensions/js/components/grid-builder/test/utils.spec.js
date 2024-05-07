/**
 * Internal Dependencies
 */
import {
	extractCssValue,
	generateAreas,
	getUniqueArrayOfObjects,
	calcCoordinates,
	calcOverlapAreas,
	updateArrayCoordinates,
	calcReMergedAreas,
	uId,
} from '../utils';

describe('Util functions', () => {
	describe('should extractCssValue function extract correct value', () => {
		test('when pass display as property', () => {
			expect(
				extractCssValue(
					'display',
					'display: grid; grid-template-column: 1fr 1fr;'
				)
			).toBe('grid');
		});

		test('when pass grid-template-rows as property', () => {
			expect(
				extractCssValue(
					'grid-template-rows',
					'display: grid; grid-template-column: 1fr 1fr; grid-template-rows: auto auto;'
				)
			).toBe('auto auto');
		});
	});

	describe('should generateAreas function generate areas correctly', () => {
		test('when there is no merged area', () => {
			const generatedAreas = generateAreas({
				gridRows: [
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				gridColumns: [
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				prevGridAreas: [],
				blockeraGridDirection: { value: 'row', dense: false },
			});

			expect([
				{
					...generatedAreas[0],
					'column-start': 1,
					'column-end': 2,
					'row-start': 1,
					'row-end': 2,
					name: 'area1',
				},
				{
					...generatedAreas[1],
					'column-start': 2,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
					name: 'area2',
				},
				{
					...generatedAreas[2],
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
					name: 'area3',
				},
				{
					...generatedAreas[3],
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
					name: 'area4',
				},
			]).toStrictEqual(generatedAreas);
		});

		test('when there are merged areas', () => {
			const generatedAreas = generateAreas({
				gridRows: [
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				gridColumns: [
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				prevGridAreas: [
					{
						id: 1,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						name: 'area1',
						mergedArea: true,
						coordinates: [
							{
								parentId: 1,
								id: 1,
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								parentId: 1,
								id: 2,
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					},
					{
						id: 2,
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
						name: 'area2',
					},
					{
						id: 3,
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
						name: 'area3',
					},
				],
				blockeraGridDirection: { value: 'row', dense: false },
			});

			expect([
				{
					...generatedAreas[0],
					'column-start': 1,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
					name: 'area1',
				},
				{
					...generatedAreas[1],
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
					name: 'area2',
				},
				{
					...generatedAreas[2],
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
					name: 'area3',
				},
			]).toStrictEqual(generatedAreas);
		});

		test('when add row & have merged area', () => {
			const generatedAreas = generateAreas({
				gridRows: [
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 3,
					},
				],
				gridColumns: [
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				prevGridAreas: [
					{
						id: 1,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						name: 'area1',
						mergedArea: true,
						coordinates: [
							{
								parentId: 1,
								id: 1,
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								parentId: 1,
								id: 2,
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					},
					{
						id: 2,
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
						name: 'area2',
					},
					{
						id: 3,
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
						name: 'area3',
					},
				],
				blockeraGridDirection: { value: 'row', dense: false },
			});

			expect([
				{
					...generatedAreas[0],
					'column-start': 1,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
					name: 'area1',
				},
				{
					...generatedAreas[1],
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
					name: 'area2',
				},
				{
					...generatedAreas[2],
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
					name: 'area3',
				},
				{
					...generatedAreas[3],
					'column-start': 1,
					'column-end': 2,
					'row-start': 3,
					'row-end': 4,
					name: 'area4',
				},
				{
					...generatedAreas[4],
					'column-start': 2,
					'column-end': 3,
					'row-start': 3,
					'row-end': 4,
					name: 'area5',
				},
			]).toStrictEqual(generatedAreas);
		});

		test('when add column & have merged area', () => {
			const generatedAreas = generateAreas({
				gridRows: [
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				gridColumns: [
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 3,
					},
				],
				prevGridAreas: [
					{
						id: 1,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						name: 'area1',
						mergedArea: true,
						coordinates: [
							{
								parentId: 1,
								id: 1,
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								parentId: 1,
								id: 2,
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					},
					{
						id: 2,
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
						name: 'area2',
					},
					{
						id: 3,
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
						name: 'area3',
					},
				],
				blockeraGridDirection: { value: 'row', dense: false },
			});

			expect([
				{
					...generatedAreas[0],
					'column-start': 1,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
					name: 'area1',
				},
				{
					...generatedAreas[1],
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 2,
					name: 'area2',
				},
				{
					...generatedAreas[2],
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
					name: 'area3',
				},
				{
					...generatedAreas[3],
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
					name: 'area4',
				},
				{
					...generatedAreas[4],
					'column-start': 3,
					'column-end': 4,
					'row-start': 2,
					'row-end': 3,
					name: 'area5',
				},
			]).toStrictEqual(generatedAreas);
		});

		test('when change direction to column', () => {
			const generatedAreas = generateAreas({
				gridRows: [
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 3,
					},
				],
				gridColumns: [
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 3,
					},
				],
				prevGridAreas: [
					{
						id: 1,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						name: 'area1',
						mergedArea: true,
						coordinates: [
							{
								parentId: 1,
								id: 1,
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								parentId: 1,
								id: 2,
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					},
					{
						id: 2,
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 2,
						name: 'area2',
					},
					{
						id: 3,
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
						name: 'area3',
					},
					{
						id: 4,
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
						name: 'area4',
					},
					{
						id: 5,
						'column-start': 3,
						'column-end': 4,
						'row-start': 2,
						'row-end': 3,
						name: 'area5',
					},
					{
						id: 6,
						'column-start': 1,
						'column-end': 2,
						'row-start': 3,
						'row-end': 4,
						name: 'area6',
					},
					{
						id: 7,
						'column-start': 2,
						'column-end': 3,
						'row-start': 3,
						'row-end': 4,
						name: 'area7',
					},
					{
						id: 8,
						'column-start': 3,
						'column-end': 4,
						'row-start': 3,
						'row-end': 4,
						name: 'area8',
					},
				],
				blockeraGridDirection: { value: 'column', dense: false },
			});

			expect([
				{
					...generatedAreas[0],
					'column-start': 1,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
					name: 'area1',
				},
				{
					...generatedAreas[1],
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
					name: 'area2',
				},
				{
					...generatedAreas[2],
					'column-start': 1,
					'column-end': 2,
					'row-start': 3,
					'row-end': 4,
					name: 'area3',
				},
				{
					...generatedAreas[3],
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
					name: 'area4',
				},
				{
					...generatedAreas[4],
					'column-start': 2,
					'column-end': 3,
					'row-start': 3,
					'row-end': 4,
					name: 'area5',
				},
				{
					...generatedAreas[5],
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 2,
					name: 'area6',
				},
				{
					...generatedAreas[6],
					'column-start': 3,
					'column-end': 4,
					'row-start': 2,
					'row-end': 3,
					name: 'area7',
				},
				{
					...generatedAreas[7],
					'column-start': 3,
					'column-end': 4,
					'row-start': 3,
					'row-end': 4,
					name: 'area8',
				},
			]).toStrictEqual(generatedAreas);
		});

		test('when remove row & have merged area', () => {
			const generatedAreas = generateAreas({
				gridRows: [
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				gridColumns: [
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				prevGridAreas: [
					{
						id: 1,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						name: 'area1',
						mergedArea: true,
						coordinates: [
							{
								parentId: 1,
								id: 1,
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								parentId: 1,
								id: 2,
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					},
					{
						id: 2,
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
						name: 'area2',
					},
					{
						id: 3,
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
						name: 'area3',
					},
					{
						id: 4,
						'column-start': 1,
						'column-end': 2,
						'row-start': 3,
						'row-end': 4,
						name: 'area4',
					},
					{
						id: 5,
						'column-start': 2,
						'column-end': 3,
						'row-start': 3,
						'row-end': 4,
						name: 'area5',
					},
				],
				blockeraGridDirection: { value: 'row', dense: false },
			});

			expect([
				{
					...generatedAreas[0],
					'column-start': 1,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
					name: 'area1',
				},
				{
					...generatedAreas[1],
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
					name: 'area2',
				},
				{
					...generatedAreas[2],
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
					name: 'area3',
				},
			]).toStrictEqual(generatedAreas);
		});

		test('when remove column & have merged area', () => {
			const generatedAreas = generateAreas({
				gridRows: [
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: 'auto',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				gridColumns: [
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 1,
					},
					{
						'sizing-mode': 'normal',
						size: '1fr',
						'min-size': '',
						'max-size': '',
						'auto-fit': false,
						id: 2,
					},
				],
				prevGridAreas: [
					{
						id: 1,
						'column-start': 1,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
						name: 'area1',
						mergedArea: true,
						coordinates: [
							{
								parentId: 1,
								id: 1,
								'column-start': 1,
								'column-end': 2,
								'row-start': 1,
								'row-end': 2,
							},
							{
								parentId: 1,
								id: 2,
								'column-start': 2,
								'column-end': 3,
								'row-start': 1,
								'row-end': 2,
							},
						],
					},
					{
						id: 2,
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 2,
						name: 'area2',
					},
					{
						id: 3,
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
						name: 'area3',
					},
					{
						id: 4,
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 3,
						name: 'area4',
					},
					{
						id: 5,
						'column-start': 3,
						'column-end': 4,
						'row-start': 2,
						'row-end': 3,
						name: 'area5',
					},
				],
				blockeraGridDirection: { value: 'row', dense: false },
			});

			expect([
				{
					...generatedAreas[0],
					'column-start': 1,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
					name: 'area1',
				},
				{
					...generatedAreas[1],
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
					name: 'area2',
				},
				{
					...generatedAreas[2],
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
					name: 'area3',
				},
			]).toStrictEqual(generatedAreas);
		});
	});

	describe('getUniqueArrayOfObjects', () => {
		it('return unique array of object based on id', () => {
			expect(
				getUniqueArrayOfObjects([
					{ id: 1 },
					{ id: 2 },
					{ id: 3 },
					{ id: 1 },
					{ id: 4 },
					{ id: 1 },
				])
			).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
		});
	});

	describe('should calcCoordinates function return correct data', () => {
		it('when invalid arg', () => {
			expect(calcCoordinates(null)).toStrictEqual([]);
		});

		it('when pass area', () => {
			const coordinates = calcCoordinates({
				'column-start': 1,
				'column-end': 3,
				'row-start': 2,
				'row-end': 4,
				id: 1,
			});

			expect([
				{
					...coordinates[0],
					parentId: 1,
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 3,
				},
				{
					...coordinates[1],
					parentId: 1,
					'column-start': 1,
					'column-end': 2,
					'row-start': 3,
					'row-end': 4,
				},
				{
					...coordinates[2],
					parentId: 1,
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
				},
				{
					...coordinates[3],
					parentId: 1,
					'column-start': 2,
					'column-end': 3,
					'row-start': 3,
					'row-end': 4,
				},
			]).toStrictEqual(coordinates);
		});
	});

	describe('calcOverlapAreas', () => {
		it('should find areas which have same coordinates with new area', () => {
			const overlapAreas = calcOverlapAreas({
				newArea: {
					id: 1,
					'column-start': 1,
					'column-end': 4,
					'row-start': 3,
					'row-end': 4,
					mergedArea: true,
					coordinates: [
						{
							parentId: 1,
							id: 1,
							'column-start': 1,
							'column-end': 2,
							'row-start': 3,
							'row-end': 4,
						},
						{
							parentId: 1,
							id: 2,
							'column-start': 2,
							'column-end': 3,
							'row-start': 3,
							'row-end': 4,
						},
						{
							parentId: 1,
							id: 3,
							'column-start': 3,
							'column-end': 4,
							'row-start': 3,
							'row-end': 4,
						},
					],
				},

				blockeraGridAreas: [
					{
						id: 1,
						'column-start': 1,
						'column-end': 2,
						'row-start': 1,
						'row-end': 2,
					},
					{
						id: 2,
						'column-start': 2,
						'column-end': 3,
						'row-start': 1,
						'row-end': 2,
					},
					{
						id: 3,
						'column-start': 3,
						'column-end': 4,
						'row-start': 1,
						'row-end': 4,
						mergedArea: true,
						coordinates: [
							{
								parentId: 3,
								id: 1,
								'column-start': 3,
								'column-end': 4,
								'row-start': 1,
								'row-end': 2,
							},
							{
								parentId: 3,
								id: 2,
								'column-start': 3,
								'column-end': 4,
								'row-start': 2,
								'row-end': 3,
							},
							{
								parentId: 3,
								id: 3,
								'column-start': 3,
								'column-end': 4,
								'row-start': 3,
								'row-end': 4,
							},
						],
					},
					{
						id: 4,
						'column-start': 1,
						'column-end': 2,
						'row-start': 2,
						'row-end': 3,
					},
					{
						id: 5,
						'column-start': 2,
						'column-end': 3,
						'row-start': 2,
						'row-end': 4,
						mergedArea: true,
						coordinates: [
							{
								parentId: 5,
								id: 1,
								'column-start': 2,
								'column-end': 3,
								'row-start': 2,
								'row-end': 3,
							},
							{
								parentId: 5,
								id: 2,
								'column-start': 2,
								'column-end': 3,
								'row-start': 3,
								'row-end': 4,
							},
						],
					},
					{
						id: 6,
						'column-start': 1,
						'column-end': 2,
						'row-start': 3,
						'row-end': 4,
					},
				],
			});

			expect([
				{
					...overlapAreas[0],
					id: 3,
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 4,
				},
				{
					...overlapAreas[1],
					id: 5,
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 4,
				},
			]).toStrictEqual(overlapAreas);
		});
	});

	describe('updateArrayCoordinates', () => {
		it('update array of object coordinates', () => {
			const areas = updateArrayCoordinates([
				{
					'column-start': 1,
					'column-end': 3,
					'row-start': 2,
					'row-end': 4,
					id: 1,
				},
				{
					'column-start': 1,
					'column-end': 2,
					'row-start': 1,
					'row-end': 3,
					id: 2,
				},
			]);

			expect([
				{
					...areas[0],
					coordinates: [
						{
							...areas[0].coordinates[0],
							parentId: 1,
							'column-start': 1,
							'column-end': 2,
							'row-start': 2,
							'row-end': 3,
						},
						{
							...areas[0].coordinates[1],
							parentId: 1,
							'column-start': 1,
							'column-end': 2,
							'row-start': 3,
							'row-end': 4,
						},
						{
							...areas[0].coordinates[2],
							parentId: 1,
							'column-start': 2,
							'column-end': 3,
							'row-start': 2,
							'row-end': 3,
						},
						{
							...areas[0].coordinates[3],
							parentId: 1,
							'column-start': 2,
							'column-end': 3,
							'row-start': 3,
							'row-end': 4,
						},
					],
				},
				{
					...areas[1],
					coordinates: [
						{
							...areas[1].coordinates[0],
							parentId: 2,
							'column-start': 1,
							'column-end': 2,
							'row-start': 1,
							'row-end': 2,
						},
						{
							...areas[1].coordinates[1],
							parentId: 2,
							'column-start': 1,
							'column-end': 2,
							'row-start': 2,
							'row-end': 3,
						},
					],
				},
			]).toStrictEqual(areas);
		});
	});

	describe('should calcReMergedAreas function updates passed item correctly', () => {
		test('when item is on the right', () => {
			const newArea = {
				id: 1,
				'column-start': 1,
				'column-end': 3,
				'row-start': 1,
				'row-end': 2,
			};

			const overlapAreas = [
				{
					id: 2,
					'column-start': 2,
					'column-end': 4,
					'row-start': 1,
					'row-end': 2,
				},
			];

			const reMergedAreas = overlapAreas.map((item) =>
				calcReMergedAreas(item, newArea)
			);

			expect([
				{
					...reMergedAreas[0],
					id: 2,
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 2,
				},
			]).toStrictEqual(reMergedAreas);
		});

		test('when item is on the left', () => {
			const newArea = {
				id: 1,
				'column-start': 3,
				'column-end': 4,
				'row-start': 1,
				'row-end': 3,
			};

			const overlapAreas = [
				{
					id: 2,
					'column-start': 1,
					'column-end': 4,
					'row-start': 2,
					'row-end': 3,
				},
			];

			const reMergedAreas = overlapAreas.map((item) =>
				calcReMergedAreas(item, newArea)
			);

			expect([
				{
					...reMergedAreas[0],
					id: 2,
					'column-start': 1,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
				},
			]).toStrictEqual(reMergedAreas);
		});

		test('when item is on the bottom', () => {
			const newArea = {
				id: 1,
				'column-start': 1,
				'column-end': 2,
				'row-start': 1,
				'row-end': 3,
			};

			const overlapAreas = [
				{
					id: 2,
					'column-start': 1,
					'column-end': 2,
					'row-start': 2,
					'row-end': 5,
				},
			];

			const reMergedAreas = overlapAreas.map((item) =>
				calcReMergedAreas(item, newArea)
			);

			expect([
				{
					...reMergedAreas[0],
					id: 2,
					'column-start': 1,
					'column-end': 2,
					'row-start': 3,
					'row-end': 5,
				},
			]).toStrictEqual(reMergedAreas);
		});

		test('when item is on the top', () => {
			const newArea = {
				id: 1,
				'column-start': 1,
				'column-end': 4,
				'row-start': 3,
				'row-end': 4,
			};
			const overlapAreas = [
				{
					id: 3,
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 4,
				},
				{
					id: 5,
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 4,
				},
			];

			const reMergedAreas = overlapAreas.map((item) =>
				calcReMergedAreas(item, newArea)
			);

			expect([
				{
					...reMergedAreas[0],
					id: 3,
					'column-start': 3,
					'column-end': 4,
					'row-start': 1,
					'row-end': 3,
				},
				{
					...reMergedAreas[1],
					id: 5,
					'column-start': 2,
					'column-end': 3,
					'row-start': 2,
					'row-end': 3,
				},
			]).toStrictEqual(reMergedAreas);
		});

		test('when item is smaller by column-start and bigger by column-end', () => {
			const newArea = {
				id: 1,
				'column-start': 3,
				'column-end': 4,
				'row-start': 1,
				'row-end': 3,
			};

			const overlapAreas = [
				{
					id: 2,
					'column-start': 1,
					'column-end': 6,
					'row-start': 1,
					'row-end': 2,
				},
			];

			const reMergedAreas = overlapAreas
				.map((item) => calcReMergedAreas(item, newArea))
				.flat();

			expect([
				{
					...reMergedAreas[0],
					'column-start': 1,
					'column-end': 3,
					'row-start': 1,
					'row-end': 2,
				},
				{
					...reMergedAreas[1],
					'column-start': 4,
					'column-end': 6,
					'row-start': 1,
					'row-end': 2,
				},
			]).toStrictEqual(reMergedAreas);
		});

		test('when item is smaller by row-start and bigger by row-end', () => {
			const newArea = {
				id: 1,
				'column-start': 1,
				'column-end': 3,
				'row-start': 3,
				'row-end': 4,
			};

			const overlapAreas = [
				{
					id: 2,
					'column-start': 1,
					'column-end': 2,
					'row-start': 1,
					'row-end': 6,
				},
			];

			const reMergedAreas = overlapAreas
				.map((item) => calcReMergedAreas(item, newArea))
				.flat();

			expect([
				{
					...reMergedAreas[0],
					'column-start': 1,
					'column-end': 2,
					'row-start': 1,
					'row-end': 3,
				},
				{
					...reMergedAreas[1],
					'column-start': 1,
					'column-end': 2,
					'row-start': 4,
					'row-end': 6,
				},
			]).toStrictEqual(reMergedAreas);
		});

		test('when its inside newArea', () => {
			const newArea = {
				id: 1,
				'column-start': 1,
				'column-end': 4,
				'row-start': 1,
				'row-end': 5,
			};

			const overlapAreas = [
				{
					id: 2,
					'column-start': 2,
					'column-end': 4,
					'row-start': 2,
					'row-end': 4,
				},
			];

			const reMergedAreas = overlapAreas
				.map((item) => calcReMergedAreas(item, newArea))
				.flat();

			expect([null]).toStrictEqual(reMergedAreas);
		});

		test('when item is equal by column-end & row-end', () => {
			const newArea = {
				id: 1,
				'column-start': 1,
				'column-end': 4,
				'row-start': 1,
				'row-end': 5,
			};

			const overlapAreas = [
				{
					id: 2,
					'column-start': 2,
					'column-end': 4,
					'row-start': 2,
					'row-end': 5,
				},
			];

			const reMergedAreas = overlapAreas
				.map((item) => calcReMergedAreas(item, newArea))
				.flat();

			expect([null]).toStrictEqual(reMergedAreas);
		});
	});

	describe('uId', () => {
		test('return random uniq number', () => {
			expect(typeof uId()).toBe('number');
		});
	});
});
