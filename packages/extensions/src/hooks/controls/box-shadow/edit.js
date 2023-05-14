/**
 * WordPress dependencies
 */
import { cloneElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './extension.json';
import { injectHelpersToCssGenerators } from '../../../api/css-generator/utils';
import { BoxShadowControl } from '@publisher/controls';
import { getCss } from '../../block-controls';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(
			helpers,
			extension.publisherCssGenerators
		),
	},
	Edit: ({ name, ...props }) => {
		return <BoxShadowControl {...props} blockName={name} />;
	},
	Save: (element, blockType, attributes) => {
		const {
			publisherAttributes: { boxShadowItems },
		} = attributes;

		if (!boxShadowItems) {
			return element;
		}

		return (
			<>
				{element}
				<style
					dangerouslySetInnerHTML={{
						__html: getCss(blockType, {
							attributes,
						}),
					}}
				/>
			</>
		);
	},
};
