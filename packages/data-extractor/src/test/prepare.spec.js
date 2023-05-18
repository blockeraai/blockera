import { prepare } from '..';

describe('API Preparing data property value testing...', () => {
	it('Access to "x.y[2]" from data with string query testing...', () => {
		const query = 'x.y[2]';
		const data = {
			x: {
				y: [1, 2, 3],
			},
		};

		expect(prepare(query, data)).toBe(3);
	});

	it('Access to "x" from data with string query testing...', () => {
		const _data = {
			x: [1, 2, 3],
		};

		const _query = 'x';

		expect(prepare(_query, _data)).toStrictEqual([1, 2, 3]);
	});

	it('Access to "x.y.z[0].type" from data with string query testing...', () => {
		const __data = {
			x: {
				y: {
					z: [
						{
							type: 'static',
						},
					],
				},
			},
		};

		const __query = 'x.y.z[0].type';

		expect(prepare(__query, __data)).toStrictEqual('static');
	});

	it('Access to "boxShadowItems[0].y" from data with string query testing...', () => {
		const data = {
			clientId: 12354645546,
			attributes: {
				boxShadowItems: [
					{
						x: '0px',
						y: '10px',
						blur: '15px',
						color: '#fff',
						spread: '20px',
						inset: 'inset',
						isVisible: true,
					},
				],
				publisherPropsId: 20230401,
			},
		};

		const query = 'attributes.boxShadowItems[0].y';

		expect(prepare(query, data)).toBe('10px');
	});
});
