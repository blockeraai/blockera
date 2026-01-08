// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { useSelect } from '@wordpress/data';
import { useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omitWithPattern, mergeObject, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { staticKeys, defaultBlockStates } from './constants';
import { sanitizeBlockAttributes } from '../../../../extensions/hooks/utils';
import { mergeBlockGlobalStyles, generateStableBlockeraPropsId } from './utils';
import { StyleVariationStylesRenderer } from './style-variation-styles-renderer';
import { GlobalStylesRenderer } from '../../../../extensions/components/global-styles-renderer';

/**
 * Renders global styles for a single block type.
 * Memoized to prevent unnecessary re-renders.
 * Follows Gutenberg patterns for global styles handling.
 */
export const StyleDefaultRenderer: ComponentType<Object> = memo(
	({ blockType }: { blockType: Object }) => {
		const { name } = blockType;

		// Select base global styles from core store
		// This follows Gutenberg's pattern for accessing base theme styles
		const baseGlobalStyles = useSelect(
			(select) => {
				const base =
					select(
						'core'
					).__experimentalGetCurrentThemeBaseGlobalStyles();

				return base?.styles?.blocks?.[name] || {};
			},
			[name]
		);

		// Select user global styles from blockera/editor store
		const userGlobalStyles = useSelect(
			(select) => {
				const { getBlockStyles } = select('blockera/editor');

				return getBlockStyles(name, 'default') || {};
			},
			[name]
		);

		// Merge base and user styles following Gutenberg patterns
		const blockGlobalStyles = useMemo(() => {
			return mergeBlockGlobalStyles(baseGlobalStyles, userGlobalStyles);
		}, [baseGlobalStyles, userGlobalStyles]);

		// Memoize filtered WordPress-compatible styles (exclude blockera for WordPress)
		const validBlockGlobalStyles = useMemo(
			() => omitWithPattern(blockGlobalStyles, /^(?!blockera).*/i),
			[blockGlobalStyles]
		);

		// Memoize stable props ID
		const stablePropsId = useMemo(
			() => generateStableBlockeraPropsId(name),
			[name]
		);

		// Memoize sanitized blockera styles
		const sanitizedBlockGlobalStyles = useMemo(() => {
			const mergedBlockStates = mergeObject(
				defaultBlockStates,
				validBlockGlobalStyles?.blockeraBlockStates?.value || {}
			);

			return sanitizeBlockAttributes({
				...validBlockGlobalStyles,
				blockeraBlockStates: mergedBlockStates,
				blockeraPropsId: stablePropsId,
			});
		}, [validBlockGlobalStyles, stablePropsId]);

		// Memoize variation entries to prevent re-renders
		const variations = useMemo(() => {
			return blockGlobalStyles?.variations || {};
		}, [blockGlobalStyles]);

		// Memoize base variation styles for each variation
		const baseVariations = useMemo(() => {
			return baseGlobalStyles?.variations || {};
		}, [baseGlobalStyles]);

		const variationEntries = useMemo(
			() => Object.entries(variations),
			[variations]
		);

		// Early return if no styles to render
		const hasSanitizedStyles =
			sanitizedBlockGlobalStyles &&
			Object.keys(sanitizedBlockGlobalStyles).length > 0;
		const hasVariations = variationEntries.length > 0;

		if (!hasSanitizedStyles && !hasVariations) {
			return null;
		}

		// Early return if only static keys with default values
		const sanitizedKeys = Object.keys(sanitizedBlockGlobalStyles);
		if (
			hasSanitizedStyles &&
			isEquals(sanitizedKeys, staticKeys) &&
			isEquals(
				defaultBlockStates,
				sanitizedBlockGlobalStyles.blockeraBlockStates
			) &&
			!hasVariations
		) {
			return null;
		}

		return (
			<>
				{hasSanitizedStyles && (
					<GlobalStylesRenderer
						{...{ ...blockType, sanitizedBlockGlobalStyles }}
					/>
				)}
				{variationEntries.map(([variationName], variationIndex) => (
					<StyleVariationStylesRenderer
						{...{
							blockType,
							variationName,
							variationGlobalStyles:
								variations[variationName] || {},
							baseVariationStyles:
								baseVariations[variationName] || {},
						}}
						key={`${name}-${variationName}-${variationIndex}`}
					/>
				))}
			</>
		);
	}
);
