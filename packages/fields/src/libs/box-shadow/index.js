/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './extension.json';
import { BoxShadowControl } from '@publisher/controls';
import {
	injectHelpersToCssGenerators,
	computedCssRules,
} from '@publisher/style-engine';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	Edit: ({ name, ...props }) => {
		//label
		//merge component && controls
		return <BoxShadowControl {...props} blockName={name} />;
	},
	Save: ({ blockType, attributes }) => {
		const { publisherBoxShadowItems } = attributes;

		if (!publisherBoxShadowItems) {
			return null;
		}

		const __css = computedCssRules(blockType, {
			attributes,
		});

		return (
			0 !== __css?.trim()?.length && (
				<style
					dangerouslySetInnerHTML={{
						__html: __css,
					}}
				/>
			)
		);
	},
};
