// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';

export type PanelBodyControlProps = {
	title: string,
	initialOpen?: boolean,
	className?: string,
	icon?: Node,
	onToggle?: () => void,
	children: Node,
};
