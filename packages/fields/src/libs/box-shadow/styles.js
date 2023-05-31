/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { cssGenerator } from './css-generator';
import { computedCssRules } from '@publisher/style-engine';
import { BlockEditContext } from '@publisher/extensions';

export function BoxShadowFieldStyle(boxShadow) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherBoxShadowItems: [
					{
						type: 'function',
						function: cssGenerator,
					},
				],
				...(boxShadow?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
