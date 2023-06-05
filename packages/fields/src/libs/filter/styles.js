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

export function FilterFieldStyle(Filter) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherFilter: [
					{
						type: 'function',
						function: cssGenerator,
					},
				],
				...(Filter?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
