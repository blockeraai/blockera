import { registerBlockExtension } from '../../api/registration';
import withBlockSettings from '../block-settings';
import block from './block.json';

describe('withBlockSettings testing...', () => {
	test('with block additional attributes', () => {
		const blockExtension = {
			publisherProps: {
				boxShadowItems: {
					type: 'array',
					default: [],
				},
			},
			publisherSupports: {
				'publisher-core/box-shadow': true,
			},
		};

		registerBlockExtension('core/paragraph', blockExtension);

		expect(withBlockSettings(block, 'core/paragraph')).toStrictEqual({
			...block,
			attributes: {
				...block.attributes,
				...blockExtension.attributes,
			},
		});
	});
});
