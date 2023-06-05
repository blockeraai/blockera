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
import {
	filterFieldCSSGenerator,
	backdropFilterFieldCSSGenerator,
} from './css-generator';

export function FilterFieldStyle(Filter) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherFilter: [
					{
						type: 'function',
						function: filterFieldCSSGenerator,
					},
				],
				...(Filter?.cssGenerators || {}),
			},
		},
		blockProps
	);
}

export function BackdropFilterFieldStyle(Filter) {
	const blockProps = useContext(BlockEditContext);

	return computedCssRules(
		{
			cssGenerators: {
				publisherBackdropFilter: [
					{
						type: 'function',
						function: backdropFilterFieldCSSGenerator,
					},
				],
				...(Filter?.cssGenerators || {}),
			},
		},
		blockProps
	);
}
