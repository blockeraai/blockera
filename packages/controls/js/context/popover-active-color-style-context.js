// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createContext, useContext } from '@wordpress/element';

export const PopoverActiveColorStyleContext: Object = createContext({});

/**
 * Read active-color CSS variables for portaled popovers.
 *
 * @return {Object} React style object; empty when no provider is mounted.
 */
export function usePopoverActiveColorStyle(): Object {
	return useContext(PopoverActiveColorStyleContext) || {};
}

/**
 * Supplies popover active-color tokens to descendant `@blockera/controls` popovers.
 * Editor mounts this from `StateContainer` — controls must not import `@blockera/editor`.
 *
 * @param {Object} props
 * @param {Object} props.value Inline style with Blockera CSS custom properties.
 * @param {MixedElement} props.children Child tree receiving popover color context.
 * @return {MixedElement} Context provider for descendant popovers.
 */
export function PopoverActiveColorStyleProvider({
	value,
	children,
}: {
	value: Object,
	children: MixedElement,
}): MixedElement {
	return (
		<PopoverActiveColorStyleContext.Provider value={value || {}}>
			{children}
		</PopoverActiveColorStyleContext.Provider>
	);
}
