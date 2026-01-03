/**
 * Type declarations for @dnd-kit packages.
 * These are stub declarations to allow TypeScript compilation.
 * Install the actual packages:
 *   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
 */

declare module '@dnd-kit/core' {
	import type { ReactNode } from 'react';

	export interface DndContextProps {
		children: ReactNode;
		sensors?: unknown[];
		collisionDetection?: unknown;
		modifiers?: Modifier[];
		onDragStart?: (event: DragStartEvent) => void;
		onDragEnd?: (event: DragEndEvent) => void;
		onDragOver?: (event: DragOverEvent) => void;
		onDragCancel?: (event: DragCancelEvent) => void;
	}

	export interface DragStartEvent {
		active: { id: string | number; data: unknown };
	}

	export interface DragEndEvent {
		active: { id: string | number; data: unknown };
		over: { id: string | number; data: unknown } | null;
		delta: { x: number; y: number };
	}

	export interface DragOverEvent {
		active: { id: string | number; data: unknown };
		over: { id: string | number; data: unknown } | null;
		delta: { x: number; y: number };
	}

	export interface DragCancelEvent {
		active: { id: string | number; data: unknown };
	}

	export interface Modifier {
		// Modifier interface
	}

	export interface Sensor {
		// Sensor interface
	}

	export function DndContext(props: DndContextProps): JSX.Element;
	export function useDraggable(props: { id: string | number; data?: unknown }): {
		setNodeRef: (node: HTMLElement | null) => void;
		attributes: Record<string, unknown>;
		listeners: Record<string, unknown>;
		isDragging: boolean;
	};
	export function useDroppable(props: { id: string | number; data?: unknown }): {
		setNodeRef: (node: HTMLElement | null) => void;
		isOver: boolean;
	};
	export function closestCenter(args: unknown): unknown;
	export class KeyboardSensor implements Sensor {}
	export class PointerSensor implements Sensor {}
	export function useSensor(sensor: Sensor, options?: unknown): Sensor;
	export function useSensors(...sensors: Sensor[]): Sensor[];
	export type { Modifier };
}

declare module '@dnd-kit/sortable' {
	import type { ReactNode } from 'react';

	export interface SortableContextProps {
		children: ReactNode;
		items: (string | number)[];
		strategy?: unknown;
	}

	export function SortableContext(props: SortableContextProps): JSX.Element;
	export function useSortable(props: {
		id: string | number;
		data?: unknown;
		disabled?: boolean;
	}): {
		setNodeRef: (node: HTMLElement | null) => void;
		attributes: Record<string, unknown>;
		listeners: Record<string, unknown>;
		isDragging: boolean;
		over: { id: string | number } | null;
		transform: { x: number; y: number } | null;
		transition: string | null;
	};
	export function sortableKeyboardCoordinates(event: KeyboardEvent, args: unknown): unknown;
	export const horizontalListSortingStrategy: unknown;
	export function arrayMove<T>(array: T[], oldIndex: number, newIndex: number): T[];
}

declare module '@dnd-kit/utilities' {
	export const CSS: {
		Transform: {
			toString: (transform: { x: number; y: number; scaleX?: number; scaleY?: number } | null) => string;
		};
		Transition: {
			toString: (transition: string | null) => string;
		};
	};
	export function arrayMove<T>(array: T[], oldIndex: number, newIndex: number): T[];
}
