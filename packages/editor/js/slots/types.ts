/**
 * Configuration for a single slot.
 */
export interface SlotConfig {
	/** Unique identifier for the slot (e.g., 'blockera/slots/editor-header-settings'). */
	id: string;
	/** Array of CSS selectors to try in order until one is found. */
	selectors: string[];
	/** Placement where the slot container should be inserted. 'start' prepends to the beginning, 'end' appends to the end, 'before' inserts before placementSelector (or found selector), 'after' inserts after placementSelector (or found selector). Defaults to 'start'. */
	placement?: 'start' | 'end' | 'before' | 'after';
	/** Optional CSS selector to find an element inside the found container for before/after placement. If not provided, before/after will work relative to the found selector element itself. */
	placementSelector?: string;
	/** Optional custom CSS class name for the slot container. If not provided, uses the auto-generated class name from slot ID. */
	className?: string;
	/** Whether to create a container element for the slot. If false, renders directly into the found container. Defaults to true. */
	createContainer?: boolean;
	/** Optional function that checks if the slot should be active. Receives a select function from @wordpress/data and should return a boolean. If provided, the slot will only render when this returns true. */
	isActive?: (select: (store: any) => any) => boolean;
}

/**
 * Props for SlotFill component.
 */
export interface SlotFillProps {
	/** Children to render in the slot. */
	children: React.ReactNode;
	/** Optional order for controlling fill order. */
	order?: number;
}

/**
 * Props for Slot component.
 */
export interface SlotProps {
	/** Slot ID to render. */
	slotId: string;
	/** Optional className for the slot container. */
	className?: string;
	/** Callback fired when slot is created or fails to create. Receives true if created, false if not. */
	onSlotCreated?: (created: boolean) => void;
}
