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

export function OutlineFieldStyle(publisherOutline) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherOutline: [
					{
						type: 'function',
						function: cssGenerator,
					},
				],
				...(publisherOutline?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
