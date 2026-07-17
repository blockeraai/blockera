// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PopoverCore } from './core';
import type { TPopoverProps } from './types';
import { DraggablePopover } from './draggable';
import { DEFAULT_POPOVER_OFFSET } from './utils';
import { usePopoverActiveColorStyle } from '../../context';
import { useInspectorPopoverOffset } from './use-inspector-popover-offset';

export default function Popover({
	draggable = true,
	style,
	anchor,
	placement = 'bottom-start',
	offset = DEFAULT_POPOVER_OFFSET,
	...props
}: TPopoverProps): MixedElement {
	const activeColorStyle = usePopoverActiveColorStyle();
	const [fallbackAnchor, setFallbackAnchor] = useState(null);

	const computedOffset = useInspectorPopoverOffset({
		explicitAnchor: anchor,
		fallbackAnchor,
		placement,
		inspectorGap: offset,
	});

	const mergedStyle = {
		...activeColorStyle,
		...(style || {}),
	};

	const popoverProps = {
		...props,
		// Keep floating-ui anchored like before: only consumer-provided anchors.
		// Resolved openers are used for offset math only so draggable transforms
		// are not overridden by continuous anchor repositioning.
		anchor: anchor ?? undefined,
		placement,
		offset: computedOffset,
		style: mergedStyle,
	};

	const popoverElement =
		draggable && props?.title ? (
			<DraggablePopover {...popoverProps} />
		) : (
			<PopoverCore {...popoverProps} />
		);

	return (
		<>
			{!anchor && (
				<span
					ref={setFallbackAnchor}
					className="blockera-popover-anchor-resolver"
					aria-hidden="true"
				/>
			)}
			{popoverElement}
		</>
	);
}
