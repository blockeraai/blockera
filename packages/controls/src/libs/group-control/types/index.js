// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type GroupControlMode = 'popover' | 'accordion' | 'nothing';

export type GroupControlProps = {
	/**
	 * The design style of group.
	 */
	design?: 'minimal',
	toggleOpenBorder?: boolean,
	isOpen?: boolean,
	//
	mode: GroupControlMode,
	popoverTitle?: string | MixedElement,
	popoverClassName?: string,
	//
	header?: string | MixedElement,
	headerOpenButton?: boolean,
	headerOpenIcon?: MixedElement,
	headerCloseIcon?: MixedElement,
	injectHeaderButtonsStart?: string | MixedElement,
	injectHeaderButtonsEnd?: string | MixedElement,
	//
	children?: string | MixedElement,
	//
	className?: string,
	onClose?: () => void,
	onOpen?: () => void,
	onClick?: (event?: MouseEvent) => boolean,
};
