import { CssGenerators } from '..';
import helpers from '../../../hooks/controls/box-shadow/helpers';

const blockProps = {
	clientId: 12354645546,
	attributes: {
		publisherAttributes: {
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
			id: 20230401,
		},
	},
};

describe('Css Generator testing ...', () => {
	test('static generator testing...', () => {
		const cssGenerator = new CssGenerators(
			'boxShadowItems',
			{
				type: 'static',
				selector: '.{BLOCK_ID} a',
				properties: [
					{
						'box-shadow':
							'inherit {Y} {BLUR} {SPREAD} {COLOR} {INSET};',
					},
				],
			},
			blockProps
		);

		expect(cssGenerator.rules())
			.toBe(`.publisher-core.extension.publisher-extension-ref.client-id-12354645546 a{
					box-shadow: inherit 10px 15px 20px #fff inset;
				}`);
	});

	test('static generator testing...', () => {
		const cssGenerator = new CssGenerators(
			'boxShadowItems',
			{
				type: 'static',
				selector: '.{BLOCK_ID} a',
				properties: [
					{
						'box-shadow':
							'inherit {Y} {BLUR} {SPREAD} {COLOR} {INSET}, {X} {Y} {BLUR} {SPREAD} {COLOR} {INSET};',
					},
				],
			},
			{
				...blockProps,
				attributes: {
					...blockProps.attributes,
					publisherAttributes: {
						...blockProps.attributes.publisherAttributes,
						boxShadowItems: [
							...blockProps.attributes.publisherAttributes
								.boxShadowItems,
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
				},
			}
		);

		expect(cssGenerator.rules())
			.toBe(`.publisher-core.extension.publisher-extension-ref.client-id-12354645546 a{
					box-shadow: inherit 10px 15px 20px #fff inset, 0px 10px 15px 20px #000 inset;
				}`);
	});

	test('function generator testing...', () => {
		const cssGenerator = new CssGenerators(
			'boxShadowItems',
			{
				type: 'function',
				function: helpers.getCssRules,
				selector: ' a.wp-element-button',
			},
			blockProps
		);

		expect(cssGenerator.rules())
			.toBe(`.publisher-core.extension.publisher-extension-ref.client-id-12354645546{
					box-shadow: 0px 10px 15px 20px #fff inset;
				}
				.publisher-box-shadow-wrapper.publisher-attrs-id-20230401 a.wp-element-button{
					box-shadow: 0px 10px 15px 20px #fff inset;
				}`);
	});
});
