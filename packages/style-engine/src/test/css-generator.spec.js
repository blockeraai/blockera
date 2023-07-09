/**
 * Internal dependencies
 */
import CssGenerators from '@publisher/style-engine';

const blockProps = {
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

describe('Css Generator testing ...', () => {
	test('static generator testing...', () => {
		const cssGenerator = new CssGenerators(
			'boxShadowItems',
			{
				type: 'static',
				selector: '.{{BLOCK_ID}} a',
				properties: {
					'box-shadow':
						'inherit {{boxShadowItems[0].y}} {{boxShadowItems[0].blur}} {{boxShadowItems[0].spread}} {{boxShadowItems[0].color}} {{boxShadowItems[0].inset}};',
				},
			},
			blockProps
		);

		expect(cssGenerator.rules()).toBe(`#block-12354645546 a{
box-shadow: inherit 10px 15px 20px #fff inset;
}`);
	});

	test('static generator testing...', () => {
		const cssGenerator = new CssGenerators(
			'boxShadowItems',
			{
				type: 'static',
				selector: '.{{BLOCK_ID}} a',
				properties: {
					'box-shadow':
						'inherit {{boxShadowItems[0].y}} {{boxShadowItems[0].blur}} {{boxShadowItems[0].spread}} {{boxShadowItems[0].color}} {{boxShadowItems[0].inset}}, {{boxShadowItems[1].x}} {{boxShadowItems[1].y}} {{boxShadowItems[1].blur}} {{boxShadowItems[1].spread}} {{boxShadowItems[1].color}} {{boxShadowItems[1].inset}};',
				},
			},
			{
				...blockProps,
				attributes: {
					...blockProps.attributes,
					boxShadowItems: [
						...blockProps.attributes.boxShadowItems,
						{
							x: '0px',
							y: '10px',
							blur: '15px',
							color: '#000',
							spread: '20px',
							inset: 'inset',
							isVisible: true,
						},
					],
				},
			}
		);

		expect(cssGenerator.rules())
			.toBe(`.publisher-core.extension.publisher-extension-ref.client-id-12354645546 a{
box-shadow: inherit 10px 15px 20px #fff inset, 0px 10px 15px 20px #000 inset;
}`);
	});
});
