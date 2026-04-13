/**
 * WordPress dependencies
 */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Tab, { type TabComponentProps } from './Tab';

/**
 * SortableTab component props.
 */
export interface SortableTabProps extends Omit<
	TabComponentProps,
	| 'onDragStart'
	| 'onDrag'
	| 'onDragEnd'
	| 'isDragging'
	| 'style'
	| 'canDrag'
	| 'hasUnsavedChanges'
> {
	/** Tab ID for sortable (must be unique). */
	id: string;
	/** Whether this tab can be dragged. */
	canDrag?: boolean;
}

/**
 * SortableTab component that wraps Tab with dnd-kit sortable functionality.
 * Uses a wrapper element to apply transforms, preserving the tab's natural dimensions.
 */
const SortableTab = memo(function SortableTab({
	id,
	canDrag = false,
	tab,
	getIsDirty,
	...tabProps
}: SortableTabProps): React.ReactElement {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		disabled: !canDrag,
	});

	// Avoid duplicate entity-store subscriptions in both SortableTab and Tab.
	// Tab already uses useEntity for reactive data; here we only need dirty state.
	const hasUnsavedChanges = getIsDirty ? getIsDirty(tab.type, tab.id) : false;

	// Wrapper style - applies transform to wrapper, not the tab itself
	// This preserves the tab's natural width/height
	const wrapperStyle: React.CSSProperties | undefined = transform
		? {
				transform: CSS.Transform.toString({
					...transform,
					scaleX: 1, // Prevent stretching
					scaleY: 1,
				}),
				transition,
			}
		: undefined;

	// Wrap Tab in a div that receives the transform
	// The Tab itself maintains its natural dimensions
	return (
		<div
			ref={setNodeRef}
			className={
				isDragging
					? 'blockera-tabs-sortable-wrapper-dragging'
					: undefined
			}
			style={{
				...wrapperStyle,
			}}
			{...attributes}
			tabIndex={-1}
		>
			<Tab
				{...tabProps}
				tab={tab}
				hasUnsavedChanges={hasUnsavedChanges}
				canDrag={canDrag}
				isDragging={isDragging}
				style={undefined} // Don't pass style to Tab - wrapper handles transforms
				dragAttributes={undefined} // Don't pass attributes to Tab, wrapper handles them
				dragListeners={listeners} // Pass listeners to Tab for drag activation
			/>
		</div>
	);
});

export default SortableTab;
