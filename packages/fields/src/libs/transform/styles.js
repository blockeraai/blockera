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
import { transformFieldCSSGenerator } from './css-generator';

export function TransformFieldStyle(Filter) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherTransform: [
					{
						type: 'function',
						function: transformFieldCSSGenerator,
					},
				],
				...(Filter?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
