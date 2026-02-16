// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	isDefaultStylesSettings,
	generateStableBlockeraPropsId,
	isVariationDisabled,
} from './utils';
import { omitWithPattern, mergeObject, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { staticKeys, defaultBlockStates } from './constants';
import { sanitizeBlockAttributes } from '../../extensions/hooks/utils';
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';
import { getBlockeraGlobalStylesMetaData } from '../global-styles/helpers';

/**
 * Renders global styles for a single block style variation.
 * Memoized to prevent unnecessary re-renders.
 */
export const StyleVariationStylesRenderer: ComponentType<Object> = memo(
	({
		blockType,
		variationName,
		variationGlobalStyles,
		blockeraMetaData,
	}: {
		blockType: Object,
		variationName: string,
		variationGlobalStyles: Object,
		blockeraMetaData?: Object,
	}) => {
		const { name } = blockType;

		// Early return for disabled styles (like style-item.js)
		const metaData =
			blockeraMetaData ?? getBlockeraGlobalStylesMetaData() ?? {};

		// Merge base and user variation styles
		const mergedVariationStyles = useMemo(() => {
			return variationGlobalStyles || {};
		}, [variationGlobalStyles]);

		// Memoize filtered blockera-specific styles
		const validBlockGlobalStyles = useMemo(
			() => omitWithPattern(mergedVariationStyles, /^(?!blockera).*/i),
			[mergedVariationStyles]
		);

		// Memoize stable props ID
		const stablePropsId = useMemo(
			() => generateStableBlockeraPropsId(`${name}-${variationName}`),
			[name, variationName]
		);

		// Memoize sanitized block global styles
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

		if (isVariationDisabled(metaData, name, variationName)) {
			return null;
		}

		// Early return if no styles to render
		if (
			(!sanitizedBlockGlobalStyles ||
				!Object.keys(sanitizedBlockGlobalStyles).length) &&
			!Object.keys(mergedVariationStyles).length
		) {
			return null;
		}

		// Early return if only static keys with default values
		const sanitizedKeys = Object.keys(sanitizedBlockGlobalStyles);
		if (
			isEquals(sanitizedKeys, staticKeys) &&
			isEquals(
				defaultBlockStates,
				sanitizedBlockGlobalStyles.blockeraBlockStates
			)
		) {
			return null;
		}

		if (isDefaultStylesSettings(sanitizedBlockGlobalStyles)) {
			return null;
		}

		return (
			<GlobalStylesRenderer
				{...{
					...blockType,
					isStyleVariation: true,
					sanitizedBlockGlobalStyles,
					styleVariationName: variationName,
				}}
			/>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison to prevent re-renders when props haven't changed
		return (
			prevProps.blockType.name === nextProps.blockType.name &&
			prevProps.variationName === nextProps.variationName &&
			isEquals(
				prevProps.variationGlobalStyles,
				nextProps.variationGlobalStyles
			) &&
			isEquals(prevProps.blockeraMetaData, nextProps.blockeraMetaData) &&
			isEquals(
				prevProps.baseVariationStyles,
				nextProps.baseVariationStyles
			)
		);
	}
);
