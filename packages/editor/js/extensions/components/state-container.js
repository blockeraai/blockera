// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { PopoverActiveColorStyleProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { getBlockeraActiveColorStyleProperties } from './blockera-active-color';
import { useBlockeraActiveColor } from './use-blockera-active-color';

export const Container = ({
	activeColor,
	variationCssVars,
	variationSurface,
	children,
}: {
	activeColor: string | void,
	variationCssVars?: Object,
	variationSurface?: string,
	children: Element<any>,
}): Element<any> => {
	const popoverActiveColorStyle = getBlockeraActiveColorStyleProperties(
		activeColor,
		variationCssVars
	);

	return (
		<PopoverActiveColorStyleProvider value={popoverActiveColorStyle}>
			<div
				className="blockera-state-colors-container"
				data-blockera-variation-surface={variationSurface || undefined}
				style={popoverActiveColorStyle}
			>
				{children}
			</div>
		</PopoverActiveColorStyleProvider>
	);
};

export default function StateContainer({
	name,
	clientId,
	children,
	availableStates,
	isGlobalStylesPanelRoot = false,
	blockeraUnsavedData,
	isGlobalStylesCardWrapper = false,
	insideBlockInspector = true,
	variationSurface,
}: Object): Element<any> {
	const { activeColor, variationCssVars } = useBlockeraActiveColor({
		name,
		clientId,
		availableStates,
		blockeraUnsavedData,
		insideBlockInspector,
		isGlobalStylesPanelRoot,
		isGlobalStylesCardWrapper,
		variationSurface,
	});

	return (
		<Container
			activeColor={activeColor}
			variationCssVars={variationCssVars}
			variationSurface={variationSurface}
		>
			{children}
		</Container>
	);
}
