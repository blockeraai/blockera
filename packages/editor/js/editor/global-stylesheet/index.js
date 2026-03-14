// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { getBlockTypes } from '@wordpress/blocks';
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

export const GlobalStyles: ComponentType<any> = memo((): MixedElement => {
	const blockTypes = getBlockTypes();

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

	return (
		<>
			{blockTypes.map((blockType: Object) => (
				<StyleDefaultRenderer
					blockType={blockType}
					key={blockType.name}
					styles={globalStyles?.[blockType.name] || {}}
					blockeraMetaData={blockeraMetaData}
				/>
			))}
		</>
	);
});

export default function GlobalStylesheet(): MixedElement {
	useEffect(() => {
		new IntersectionObserverRenderer('iframe', GlobalStyles, {
			isRootComponent: true,
			targetElementIsRoot: true,
			componentSelector: '#blockera-global-styles-wrapper',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
