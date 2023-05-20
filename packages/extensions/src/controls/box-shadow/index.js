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
		...injectHelpersToCssGenerators(
			helpers,
			extension.publisherCssGenerators
		),
	},
	Edit: ({ name, ...props }) => {
		return <BoxShadowControl {...props} blockName={name} />;
	},
	Save: (element, blockType, attributes) => {
		const { boxShadowItems } = attributes;

		if (!boxShadowItems) {
			return element;
		}

		const __css = computedCssRules(blockType, {
			attributes,
		});

		return (
			<>
				{element}
				{0 !== __css?.trim()?.length && (
					<style
						dangerouslySetInnerHTML={{
							__html: __css,
						}}
					/>
				)}
			</>
		);
	},
};
