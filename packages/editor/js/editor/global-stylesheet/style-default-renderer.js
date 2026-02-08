// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omitWithPattern, mergeObject, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { generateStableBlockeraPropsId } from './utils';
import { staticKeys, defaultBlockStates } from './constants';
import { sanitizeBlockAttributes } from '../../extensions/hooks/utils';
import { StyleVariationStylesRenderer } from './style-variation-styles-renderer';
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';

/**
 * Renders global styles for a single block type.
 * Memoized to prevent unnecessary re-renders.
 * Follows Gutenberg patterns for global styles handling.
 */
export const StyleDefaultRenderer: ComponentType<Object> = memo(
	({
		styles: blockGlobalStyles,
		blockType,
	}: {
		styles: Object,
		blockType: Object,
	}) => {
		const { name } = blockType;

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
						}}
						key={`${name}-${variationName}-${variationIndex}`}
					/>
				))}
			</>
		);
	}
);
