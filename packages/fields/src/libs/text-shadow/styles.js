/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { cssGenerator } from './css-generator';

export function TextShadowFieldStyle(textShadow) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherTextShadow: [
					{
						type: 'function',
						function: cssGenerator,
					},
				],
				...(textShadow?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
