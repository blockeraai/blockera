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
import { usePopoverActiveColorStyle } from '../../context';
import type { TPopoverProps } from './types';

export default function Popover({
	draggable = true,
	style,
	...props
}: TPopoverProps): MixedElement {
	const activeColorStyle = usePopoverActiveColorStyle();
	const mergedStyle = {
		...activeColorStyle,
		...(style || {}),
	};

	return draggable && props?.title ? (
		<DraggablePopover {...props} style={mergedStyle} />
	) : (
		<PopoverCore {...props} style={mergedStyle} />
	);
}
