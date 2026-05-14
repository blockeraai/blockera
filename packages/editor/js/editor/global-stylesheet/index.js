// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';
import type { MixedElement, ComponentType } from 'react';
import { useEffect, memo, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { mergeBlockGlobalStyles } from './utils';
import { StyleDefaultRenderer } from './style-default-renderer';
import { getBlockeraGlobalStylesMetaData } from '../global-styles/helpers';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';

type GlobalStylesProps = {
	blockType?: Object | null,
	/** Runs on block-level slice (everything except `variations`) and on each variation entry separately when set. */
	getCompatibleStyles?: (rawStyles: Object) => Object,
};

/**
 * Renders merged global styles for a single WordPress block type.
 * When `getCompatibleStyles` is set, it is applied to the root block slice (omit `variations`)
 * and to each variation’s own object before merging back into `{ ...root, variations }`.
 */
export const GlobalStyles: ComponentType<GlobalStylesProps> = memo(
	({
		blockType,
		getCompatibleStyles,
	}: GlobalStylesProps): MixedElement | null => {
		// Select base global styles from core store
		// This follows Gutenberg's pattern for accessing base theme styles
		const baseGlobalStyles = useSelect((select) => {
			const base =
				select('core').__experimentalGetCurrentThemeBaseGlobalStyles();

			return base?.styles?.blocks || {};
		}, []);

		// Select user global styles and blockera metadata; merge blockeraGlobalStylesMetaData from window before use
		const { userGlobalStyles, blockeraMetaData } = useSelect((select) => {
			const { getGlobalStyles } = select('blockera/editor');
			const userStyles = getGlobalStyles()?.userStyles || {};
			const storeMetaData = userStyles?.blockeraMetaData || {};
			const windowMetaData = getBlockeraGlobalStylesMetaData() || {};

			return {
				userGlobalStyles: userStyles?.styles?.blocks || {},
				blockeraMetaData: mergeObject(storeMetaData, windowMetaData),
			};
		}, []);

		// Merge base and user styles following Gutenberg patterns
		const globalStyles = useMemo(() => {
			return mergeBlockGlobalStyles(baseGlobalStyles, userGlobalStyles);
		}, [baseGlobalStyles, userGlobalStyles]);

		const blockName =
			blockType && typeof blockType.name === 'string'
				? blockType.name
				: '';

		const rawStylesForBlock = useMemo(() => {
			if (!blockName) {
				return {};
			}
			return globalStyles?.[blockName] || {};
		}, [globalStyles, blockName]);

		const styles = useMemo(() => {
			if (typeof getCompatibleStyles !== 'function') {
				return rawStylesForBlock;
			}

			const raw =
				rawStylesForBlock && typeof rawStylesForBlock === 'object'
					? rawStylesForBlock
					: {};

			const { variations: rawVariations, ...rootWithoutVariations } = raw;

			const compatibleRoot = getCompatibleStyles(rootWithoutVariations);

			const sourceVariations =
				rawVariations && typeof rawVariations === 'object'
					? rawVariations
					: {};

			const compatibleVariations: Object = {};
			for (const [slug, variationSlice] of Object.entries(
				sourceVariations
			)) {
				compatibleVariations[slug] = getCompatibleStyles(
					variationSlice && typeof variationSlice === 'object'
						? variationSlice
						: {}
				);
			}

			const merged: Object = {
				...(compatibleRoot && typeof compatibleRoot === 'object'
					? compatibleRoot
					: {}),
			};

			if (Object.keys(compatibleVariations).length > 0) {
				merged.variations = compatibleVariations;
			}

			return merged;
		}, [getCompatibleStyles, rawStylesForBlock]);

		if (!blockType || !blockName) {
			return null;
		}

		return (
			<StyleDefaultRenderer
				blockType={blockType}
				key={blockName}
				styles={styles}
				blockeraMetaData={blockeraMetaData}
			/>
		);
	}
);

/**
 * Iframe root: one {@see GlobalStyles} per registered block type (no compatibility pass).
 */
const GlobalStylesIframeBundle: ComponentType<{}> = memo((): MixedElement => {
	const blockTypes = useSelect(
		(select) => select(blocksStore).getBlockTypes(),
		[]
	);

	return (
		<>
			{blockTypes.map((blockType: Object) => (
				<GlobalStyles blockType={blockType} key={blockType.name} />
			))}
		</>
	);
});

export default function GlobalStylesheet(): MixedElement {
	useEffect(() => {
		new IntersectionObserverRenderer('iframe', GlobalStylesIframeBundle, {
			isRootComponent: true,
			targetElementIsRoot: true,
			componentSelector: '#blockera-global-styles-wrapper',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
