// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { getBlockTypes } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import { useEffect, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { StyleDefaultRenderer } from './style-default-renderer';
import { IntersectionObserverRenderer } from '../../../intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Output
 * Renders global styles for all block types in the iframe.
 */
export const registerGlobalStylesOutputPlugin = (): void => {
	const blockTypes = getBlockTypes();

	const GlobalStyles = memo((): MixedElement => (
		<>
			{blockTypes.map((blockType: Object) => (
				<StyleDefaultRenderer
					blockType={blockType}
					key={blockType.name}
				/>
			))}
		</>
	));

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
