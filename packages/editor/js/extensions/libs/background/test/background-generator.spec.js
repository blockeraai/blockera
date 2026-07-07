/**
 * Internal dependencies
 */
import {
	backgroundFromWPCompatibility,
	backgroundToWPCompatibility,
} from '../compatibility/background-image';
import { elementNormalBackgroundFromWPCompatibility } from '../../block-card/inner-blocks/compatibility/element-bg';
import {
	normalizeWpGradientSentinel,
	createNoneBackgroundLayer,
} from '../compatibility/wp-gradient-sentinel';

describe('wp-gradient-sentinel', () => {
	test('normalizeWpGradientSentinel matches after trim only', () => {
		expect(normalizeWpGradientSentinel('none')).toBe('none');
		expect(normalizeWpGradientSentinel('  none  ')).toBe('none');
		expect(normalizeWpGradientSentinel('transparent none')).toBe(
			'transparent-none'
		);
		expect(normalizeWpGradientSentinel('  transparent none  ')).toBe(
			'transparent-none'
		);
		expect(
			normalizeWpGradientSentinel(
				'linear-gradient(135deg,rgb(0,0,0) 0%,rgb(255,255,255) 100%)'
			)
		).toBe(false);
		expect(normalizeWpGradientSentinel('None')).toBe(false);
	});

	test('createNoneBackgroundLayer matches control shape', () => {
		expect(createNoneBackgroundLayer()).toEqual({
			type: 'none',
			isVisible: true,
			order: 0,
		});
	});
});

describe('backgroundFromWPCompatibility', () => {
	test('maps style.color.gradient "none" to none background layer', () => {
		const result = backgroundFromWPCompatibility({
			attributes: {
				style: {
					color: {
						gradient: 'none',
					},
				},
			},
			insideBlockInspector: true,
		});

		expect(result.blockeraBackground.value['none-0']).toEqual({
			type: 'none',
			isVisible: true,
			order: 0,
		});
		expect(
			result.blockeraBackground.value['linear-gradient-0']
		).toBeUndefined();
		expect(
			result.blockeraBackground.value['radial-gradient-0']
		).toBeUndefined();
	});

	test('maps style.color.gradient "transparent none" to none layer and transparent color', () => {
		const result = backgroundFromWPCompatibility({
			attributes: {
				style: {
					color: {
						gradient: 'transparent none',
					},
				},
			},
			insideBlockInspector: true,
		});

		expect(result.blockeraBackground.value['none-0'].type).toBe('none');
		expect(result.blockeraBackgroundColor.value).toBe('transparent');
	});

	test('maps trimmed sentinel whitespace', () => {
		const result = backgroundFromWPCompatibility({
			attributes: {
				style: {
					color: {
						gradient: '  none  ',
					},
				},
			},
			insideBlockInspector: true,
		});

		expect(result.blockeraBackground.value['none-0'].type).toBe('none');
	});

	test('still maps real linear gradients', () => {
		const gradient =
			'linear-gradient(135deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)';
		const result = backgroundFromWPCompatibility({
			attributes: {
				style: {
					color: {
						gradient,
					},
				},
			},
			insideBlockInspector: true,
		});

		expect(
			result.blockeraBackground.value['linear-gradient-0']
		).toMatchObject({
			type: 'linear-gradient',
			'linear-gradient': gradient,
			'linear-gradient-angel': '135',
		});
		expect(result.blockeraBackground.value['none-0']).toBeUndefined();
	});
});

describe('elementNormalBackgroundFromWPCompatibility', () => {
	test('maps element gradient "none" to inner block none layer', () => {
		const result = elementNormalBackgroundFromWPCompatibility({
			innerBlock: 'elements/link',
			attributes: {
				style: {
					elements: {
						link: {
							color: {
								gradient: 'none',
							},
						},
					},
				},
			},
			dataCompatibilityElement: 'link',
			insideBlockInspector: true,
		});

		expect(result).toEqual({
			blockeraInnerBlocks: {
				value: {
					'elements/link': {
						attributes: {
							blockeraBackground: {
								'none-0': {
									type: 'none',
									isVisible: true,
									order: 0,
								},
							},
						},
					},
				},
			},
		});
	});

	test('maps element gradient "transparent none" to none layer and transparent color', () => {
		const result = elementNormalBackgroundFromWPCompatibility({
			innerBlock: 'elements/link',
			attributes: {
				style: {
					elements: {
						link: {
							color: {
								gradient: 'transparent none',
							},
						},
					},
				},
			},
			dataCompatibilityElement: 'link',
			insideBlockInspector: true,
		});

		expect(
			result.blockeraInnerBlocks.value['elements/link'].attributes
				.blockeraBackground['none-0'].type
		).toBe('none');
		expect(
			result.blockeraInnerBlocks.value['elements/link'].attributes
				.blockeraBackgroundColor
		).toBe('transparent');
	});
});

describe('backgroundToWPCompatibility', () => {
	test('none type clears WP layered background attributes', () => {
		const result = backgroundToWPCompatibility({
			newValue: {
				'none-0': {
					type: 'none',
					isVisible: true,
				},
			},
			insideBlockInspector: true,
		});

		expect(result).toEqual({
			style: {
				background: {
					backgroundImage: undefined,
					backgroundSize: undefined,
					backgroundPosition: undefined,
					backgroundRepeat: undefined,
				},
				color: {
					gradient: undefined,
				},
			},
			gradient: undefined,
		});
	});
});
