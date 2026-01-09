// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useSelect } from '@wordpress/data';
import { getBlockTypes } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import { useEffect, memo, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { mergeBlockGlobalStyles } from './utils';
import { StyleDefaultRenderer } from './style-default-renderer';
import { IntersectionObserverRenderer } from '../../../intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Output
 * Renders global styles for all block types in the iframe.
 */
export const registerGlobalStylesOutputPlugin = (): void => {
	const blockTypes = getBlockTypes();

	const GlobalStyles = memo((): MixedElement => {
		// Select base global styles from core store
		// This follows Gutenberg's pattern for accessing base theme styles
		const baseGlobalStyles = useSelect((select) => {
			const base =
				select('core').__experimentalGetCurrentThemeBaseGlobalStyles();

			return base?.styles?.blocks || {};
		}, []);

		// Select user global styles from blockera/editor store
		const userGlobalStyles = useSelect((select) => {
			const { getGlobalStyles } = select('blockera/editor');

			return getGlobalStyles()?.userStyles?.styles?.blocks || {};
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
					/>
				))}
			</>
		);
	});

	registerPlugin('blockera-global-styles-output', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer('iframe', GlobalStyles, {
					isRootComponent: true,
					targetElementIsRoot: true,
					componentSelector: '#blockera-global-styles-wrapper',
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
