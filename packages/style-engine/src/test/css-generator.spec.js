/**
 * Internal dependencies
 */
import { CssGenerator } from '@publisher/style-engine';

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
		publisherBackgroundColor: 'transparent',
		publisherPropsId: 20230401,
	},
};

describe('Style Engine Testing ...', () => {
	test('box-shadow static generator testing...', () => {
		const cssGenerator = new CssGenerator(
			'boxShadowItems',
			{
				type: 'static',
				selector: '.{{BLOCK_ID}} a',
				properties: {
					'box-shadow':
						'inherit {{boxShadowItems[0].y}} {{boxShadowItems[0].blur}} {{boxShadowItems[0].spread}} {{boxShadowItems[0].color}} {{boxShadowItems[0].inset}}',
				},
			},
			blockProps
		);

		expect(cssGenerator.rules()).toBe(`#block-12354645546 a{
box-shadow: inherit 10px 15px 20px #fff inset;
}`);
	});

	test('box-shadow static generator (with semicolon and multi shadow) testing...', () => {
		const cssGenerator = new CssGenerator(
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

		expect(cssGenerator.rules()).toBe(`#block-12354645546 a{
box-shadow: inherit 10px 15px 20px #fff inset, 0px 10px 15px 20px #000 inset;
}`);
	});

	test('background-color static generator testing...', () => {
		const cssGenerator = new CssGenerator(
			'backgroundColor',
			{
				type: 'static',
				selector: '.{{BLOCK_ID}}',
				properties: {
					'background-color': '{{publisherBackgroundColor}}',
				},
			},
			blockProps
		);

		expect(cssGenerator.rules()).toBe(
			`#block-12354645546{
background-color: transparent;
}`
		);
	});

	test('opacity static generator testing...', () => {
		const cssGenerator = new CssGenerator(
			'opacity',
			{
				type: 'static',
				selector: '.{{BLOCK_ID}}',
				properties: {
					opacity: '{{publisherOpacity}}',
				},
			},
			{
				...blockProps,
				attributes: {
					...blockProps.attributes,
					publisherOpacity: '20%',
				},
			}
		);

		expect(cssGenerator.rules()).toBe(
			`#block-12354645546{
opacity: 20%;
}`
		);
	});

	test('should generate css rules with important flag', () => {
		const cssGenerator = new CssGenerator(
			'opacity',
			{
				type: 'static',
				selector: '.{{BLOCK_ID}}',
				properties: {
					opacity: '{{publisherOpacity}}',
				},
				options: {
					important: true,
				},
			},
			{
				...blockProps,
				attributes: {
					...blockProps.attributes,
					publisherOpacity: '20%',
				},
			}
		);

		expect(cssGenerator.rules()).toBe(
			`#block-12354645546{
opacity: 20% !important;
}`
		);
	});
});
