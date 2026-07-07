// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useLayoutEffect, useMemo, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { PopoverActiveColorStyleProvider } from '@blockera/controls';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	getBlockeraActiveColorScopeFlags,
	getBlockeraActiveColorStyleProperties,
} from '../../../extensions/components/blockera-active-color';
import { useBlockeraActiveColor } from '../../../extensions/components/use-blockera-active-color';
import type { GlobalStylesPanelActiveColorStore } from './global-styles-panel-active-color-store';

const EMPTY_STYLE: Object = {};

type ShellProps = {
	store: GlobalStylesPanelActiveColorStore,
	blockName: string,
	fallbackClientId: string,
	variationSurface: string,
	blockeraUnsavedData?: Object,
	children: MixedElement,
};

/**
 * Resolves global-styles popover active color once per panel App (style / size)
 * and publishes it to the external store + {@see PopoverActiveColorStyleProvider}.
 */
export function GlobalStylesPanelActiveColorShell({
	store,
	blockName,
	fallbackClientId,
	variationSurface,
	blockeraUnsavedData,
	children,
}: ShellProps): MixedElement {
	const scopeFlags = useMemo(
		() =>
			getBlockeraActiveColorScopeFlags({
				insideBlockInspector: false,
				isGlobalStylesPanelRoot: false,
				isGlobalStylesCardWrapper: true,
				variationSurface,
			}),
		[variationSurface]
	);

	const { activeColor, variationCssVars } = useBlockeraActiveColor({
		name: blockName,
		clientId: fallbackClientId,
		blockeraUnsavedData,
		...scopeFlags,
	});

	const popoverActiveColorStyle = useMemo(
		() =>
			getBlockeraActiveColorStyleProperties(
				activeColor,
				variationCssVars
			),
		[activeColor, variationCssVars]
	);

	const providerValueRef = useRef(EMPTY_STYLE);

	if (!isEquals(providerValueRef.current, popoverActiveColorStyle)) {
		providerValueRef.current = popoverActiveColorStyle;
	}

	useLayoutEffect(() => {
		store.setSnapshot(providerValueRef.current);
	}, [store, popoverActiveColorStyle]);

	return (
		<PopoverActiveColorStyleProvider value={providerValueRef.current}>
			{children}
		</PopoverActiveColorStyleProvider>
	);
}
