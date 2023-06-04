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

export function BoxShadowFieldStyle(boxShadow) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherBoxShadow: [
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
