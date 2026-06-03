// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Internal dependencies
 */
import { StyleItem } from './style-item';

export function SortableStyleItem({ style }: { style: Object }): MixedElement {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: style.name });

	return (
		<StyleItem
			style={style}
			inGlobalStylesPanel={true}
			dragSortBindings={{
				setNodeRef,
				attributes,
				listeners,
				isDragging,
				style: {
					transform: CSS.Transform.toString(transform),
					transition,
					...(isDragging
						? {
								opacity: 0.82,
								zIndex: 1,
							}
						: {}),
				},
			}}
		/>
	);
}
