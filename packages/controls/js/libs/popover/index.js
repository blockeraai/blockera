// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { PopoverCore } from './core';
import { DraggablePopover } from './draggable';
import { useStateContainerActiveColorStyle } from './use-state-container-active-color-style';
import type { TPopoverProps } from './types';

export default function Popover({
	draggable = true,
	style,
	...props
}: TPopoverProps): MixedElement {
	const stateContainerStyle = useStateContainerActiveColorStyle(props.anchor);
	const mergedStyle = {
		...stateContainerStyle,
		...(style || {}),
	};

	return draggable && props?.title ? (
		<DraggablePopover {...props} style={mergedStyle} />
	) : (
		<PopoverCore {...props} style={mergedStyle} />
	);
}
