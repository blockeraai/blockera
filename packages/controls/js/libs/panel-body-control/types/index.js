// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';

export type PanelBodyControlProps = {
	/**
	 * Title of Inspect Element
	 */
	title: string,
	/**
	 * Default open or close status for panel body
	 */
	initialOpen?: boolean,
	/**
	 * Icon for panel body
	 */
	icon?: Node,
	/**
	 * Function that will be fired while opening or closing of panel body
	 */
	onToggle?: () => void,
	/**
	 * Is panel content changed to show change indicator
	 */
	isChanged?: boolean,
	/**
	 * Is panel content changed on states to show change indicator
	 */
	isChangedOnStates?: boolean,
	children: Node,
	className?: string,
	/**
	 * Show Blockera powered by branding
	 */
	showPoweredBy?: boolean,
};
