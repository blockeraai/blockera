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

export function TransitionFieldStyle(Transition) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherTransition: [
					{
						type: 'function',
						function: cssGenerator,
					},
				],
				...(Transition?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
