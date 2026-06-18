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
import { DraggablePopover } from './draggable';
import { usePopoverActiveColorStyle } from '../../context';
import {
	useInspectorPopoverOffset,
	useResolvedPopoverAnchor,
} from './use-inspector-popover-offset';
import type { TPopoverProps } from './types';

export default function Popover({
	draggable = true,
	style,
	anchor,
	placement = 'bottom-start',
	offset = 10,
	...props
}: TPopoverProps): MixedElement {
	const activeColorStyle = usePopoverActiveColorStyle();
	const [fallbackAnchor, setFallbackAnchor] = useState(null);
	const resolvedAnchor = useResolvedPopoverAnchor(anchor, fallbackAnchor);

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
		anchor: resolvedAnchor ?? undefined,
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
