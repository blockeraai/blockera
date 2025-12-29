// @flow

/**
 * External dependencies
 */
import { memo, useMemo, useEffect } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect } from '@wordpress/data';
import type { MixedElement } from 'react';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject, omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { sanitizeBlockAttributes } from '../../../extensions/hooks/utils';
import { useGlobalStylesContext } from '../../components/block-global-styles-panel-screen/global-styles-provider';
import { GlobalStylesRenderer } from '../../../extensions/components/global-styles-renderer';
import { IntersectionObserverRenderer } from '../../intersection-observer-renderer';

// Constants for style rendering
const staticKeys = ['blockeraBlockStates', 'blockeraPropsId'];
const defaultBlockStates = {
	normal: {
		breakpoints: {},
		isVisible: true,
	},
};
const blockeraPropsId = Math.random().toString(36).substring(2, 15);

/**
 * Renders global styles for a single block style variation.
 */
const GlobalBlockStyleVariationStylesRenderer = memo(
	({
		blockType,
		variationName,
		variationGlobalStyles,
	}: {
		blockType: Object,
		variationName: string,
		variationGlobalStyles: Object,
	}) => {
		// Filter to only blockera-specific styles
		const memoizedGlobalStyles = omitWithPattern(
			variationGlobalStyles || {},
			/^(?!blockera).*/i
		);

		// Sanitize and merge block states
		const blockeraBlockTypeGlobalStyles = sanitizeBlockAttributes({
			...memoizedGlobalStyles,
			blockeraBlockStates: mergeObject(
				defaultBlockStates,
				memoizedGlobalStyles?.blockeraBlockStates?.value || {}
			),
			blockeraPropsId,
		});

		// Early return if no styles to render
		if (
			(!blockeraBlockTypeGlobalStyles ||
				!Object.keys(blockeraBlockTypeGlobalStyles).length) &&
			!Object.keys(variationGlobalStyles).length
		) {
			return null;
		}

		// Early return if only static keys with default values
		if (
			isEquals(Object.keys(blockeraBlockTypeGlobalStyles), staticKeys) &&
			isEquals(
				defaultBlockStates,
				blockeraBlockTypeGlobalStyles.blockeraBlockStates
			)
		) {
			return null;
		}

		return (
			<GlobalStylesRenderer
				{...{
					...blockType,
					isStyleVariation: true,
					blockeraBlockTypeGlobalStyles,
					styleVariationName: variationName,
				}}
			/>
		);
	}
);

/**
 * Renders global styles for a single block type.
 */
const GlobalBlockStylesRenderer = memo((blockType: Object) => {
	const { name } = blockType;

	// Get WordPress global styles for this block type
	const wpBlockTypeGlobalStyles = useGlobalStylesContext({
		single: true,
		from: 'merged',
		path: `styles.blocks.${name}`,
	});

	// Get local block type global styles from store
	const { localBlockTypeGlobalStyles } = useSelect(
		(select) => {
			const { getBlockStyles } = select('blockera/editor');

			return {
				localBlockTypeGlobalStyles: getBlockStyles(name, 'default'),
			};
		},
		[name]
	);

	// Merge WordPress and local styles (prefer local if exists)
	const blockTypeGlobalStyles = !Object.keys(localBlockTypeGlobalStyles)
		.length
		? mergeObject(wpBlockTypeGlobalStyles, localBlockTypeGlobalStyles)
		: localBlockTypeGlobalStyles;

	// Filter out blockera-specific styles for WordPress compatibility
	const memoizedBlockTypeGlobalStyles = omitWithPattern(
		blockTypeGlobalStyles || {},
		/^(?=blockera).*/i
	);

	// Memoize sanitized blockera styles
	const blockeraBlockTypeGlobalStyles = useMemo(
		() =>
			sanitizeBlockAttributes({
				...memoizedBlockTypeGlobalStyles,
				blockeraBlockStates: mergeObject(
					defaultBlockStates,
					memoizedBlockTypeGlobalStyles?.blockeraBlockStates?.value ||
						{}
				),
				blockeraPropsId,
			}),
		[memoizedBlockTypeGlobalStyles]
	);

	// Early return if no styles to render
	if (
		(!blockeraBlockTypeGlobalStyles ||
			!Object.keys(blockeraBlockTypeGlobalStyles).length) &&
		!blockTypeGlobalStyles?.variations
	) {
		return null;
	}

	// Early return if only static keys with default values
	if (
		isEquals(Object.keys(blockeraBlockTypeGlobalStyles), staticKeys) &&
		isEquals(
			defaultBlockStates,
			blockeraBlockTypeGlobalStyles.blockeraBlockStates
		)
	) {
		return null;
	}

	return (
		<>
			<GlobalStylesRenderer
				{...{ ...blockType, blockeraBlockTypeGlobalStyles }}
			/>
			{Object.entries(blockTypeGlobalStyles?.variations || {}).map(
				([variationName], variationIndex) => (
					<GlobalBlockStyleVariationStylesRenderer
						{...{
							blockType,
							variationName,
							variationIndex,
							variationGlobalStyles:
								blockTypeGlobalStyles?.variations?.[
									variationName
								] || {},
						}}
						key={`${name}-${variationName}-${variationIndex}`}
					/>
				)
			)}
		</>
	);
});

/**
 * Plugin: Blockera Global Styles Output
 * Renders global styles for all block types in the iframe.
 */
export const registerGlobalStylesOutputPlugin = (): void => {
	const blockTypes = getBlockTypes();

	const GlobalStylesComponent = () => {
		return blockTypes.map(
			(blockType: Object, blockIndex: number): MixedElement => (
				<GlobalBlockStylesRenderer
					{...blockType}
					key={`${blockType.name}-${blockIndex}`}
				/>
			)
		);
	};

	registerPlugin('blockera-global-styles-output', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					'iframe',
					GlobalStylesComponent,
					{
						isRootComponent: true,
						targetElementIsRoot: true,
						componentSelector: '#blockera-global-styles-wrapper',
					}
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
