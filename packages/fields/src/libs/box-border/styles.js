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

export function BoxBorderFieldStyle(boxBorder) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherBorder: [
					{
						type: 'function',
						function: cssGenerator,
					},
				],
				...(boxBorder?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
