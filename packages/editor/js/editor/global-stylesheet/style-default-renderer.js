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
import {
	isDefaultStylesSettings,
	generateStableBlockeraPropsId,
	isVariationDisabled,
} from './utils';
import { staticKeys, defaultBlockStates } from './constants';
import { sanitizeBlockAttributes } from '../../extensions/hooks/utils';
import { StyleVariationStylesRenderer } from './style-variation-styles-renderer';
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';
import {
	isSizeVariationEntry,
	BLOCK_SIZE_VARIATION_CLASS_PREFIX,
} from '../global-styles/panel/size-variations';

const DEFAULT_STYLE_VARIATION_CLASS_PREFIX = 'is-style-';

/**
 * Renders global styles for a single block type.
 * Memoized to prevent unnecessary re-renders.
 * Follows Gutenberg patterns for global styles handling.
 */
export const StyleDefaultRenderer: ComponentType<Object> = memo(
	({
		styles: blockGlobalStyles,
		blockType,
		blockeraMetaData = {},
	}: {
		styles: Object,
		blockType: Object,
		blockeraMetaData?: Object,
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

		const variationSlices = useMemo(() => {
			const variationsSrc = blockGlobalStyles?.variations;
			const variationsBase =
				variationsSrc && typeof variationsSrc === 'object'
					? variationsSrc
					: {};

			const entries = [];
			for (const [variationName, data] of Object.entries(
				variationsBase
			)) {
				if (
					!isVariationDisabled(blockeraMetaData, name, variationName)
				) {
					entries.push([variationName, data]);
				}
			}

			const styleSurface = [];
			const sizeSurface = [];
			for (const entry of entries) {
				const data = entry[1];
				if (!isSizeVariationEntry(data)) {
					styleSurface.push(entry);
				} else if (data?.blockeraIsDefaultVariation !== true) {
					sizeSurface.push(entry);
				}
			}

			return {
				variations: variationsBase,
				variationEntries: entries,
				styleSurfaceVariationEntries: styleSurface,
				sizeSurfaceVariationEntries: sizeSurface,
			};
		}, [blockGlobalStyles, blockeraMetaData, name]);

		const variations = variationSlices.variations;
		const styleSurfaceVariationEntries =
			variationSlices.styleSurfaceVariationEntries;
		const sizeSurfaceVariationEntries =
			variationSlices.sizeSurfaceVariationEntries;

		const hasVariations = variationSlices.variationEntries.length > 0;

		const hasSanitizedStyles =
			sanitizedBlockGlobalStyles &&
			Object.keys(sanitizedBlockGlobalStyles).length > 0;

		// Early return if no styles to render
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
				{hasSanitizedStyles &&
					!isDefaultStylesSettings(sanitizedBlockGlobalStyles) && (
						<GlobalStylesRenderer
							{...{ ...blockType, sanitizedBlockGlobalStyles }}
						/>
					)}
				{styleSurfaceVariationEntries.map(
					([variationName], variationIndex) => (
						<StyleVariationStylesRenderer
							{...{
								blockType,
								variationName,
								blockeraMetaData,
								variationGlobalStyles:
									variations[variationName] || {},
								variationClassPrefix:
									DEFAULT_STYLE_VARIATION_CLASS_PREFIX,
							}}
							key={`${name}-style-${variationName}-${variationIndex}`}
						/>
					)
				)}
				{sizeSurfaceVariationEntries.map(
					([variationName], variationIndex) => (
						<StyleVariationStylesRenderer
							{...{
								blockType,
								variationName,
								blockeraMetaData,
								variationGlobalStyles:
									variations[variationName] || {},
								variationClassPrefix:
									BLOCK_SIZE_VARIATION_CLASS_PREFIX,
							}}
							key={`${name}-size-${variationName}-${variationIndex}`}
						/>
					)
				)}
			</>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.blockType?.name === nextProps.blockType?.name &&
			prevProps.blockType?.attributes ===
				nextProps.blockType?.attributes &&
			isEquals(prevProps.styles, nextProps.styles) &&
			isEquals(prevProps.blockeraMetaData, nextProps.blockeraMetaData)
		);
	}
);
