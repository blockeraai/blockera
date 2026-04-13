/**
 * WordPress dependencies
 */
import type { ReactNode } from 'react';

/**
 * Module-level registry for fill ordering.
 * Uses WeakMap to store order for each fill instance.
 */
const fillOrderMap = new WeakMap<object, number>();

/**
 * Register a fill instance with an order.
 */
export function registerFillOrder(instance: object, order: number): void {
	fillOrderMap.set(instance, order);
}

/**
 * Unregister a fill instance.
 */
export function unregisterFillOrder(instance: object): void {
	fillOrderMap.delete(instance);
}

/**
 * Get the order for a fill instance.
 */
export function getFillOrder(instance: object): number {
	return fillOrderMap.get(instance) ?? 999;
}

/**
 * Hook to access fill order functions.
 * Provided for consistency, but uses module-level registry.
 */
export function useFillOrder() {
	return {
		registerFill: registerFillOrder,
		unregisterFill: unregisterFillOrder,
		getOrder: getFillOrder,
	};
}

/**
 * Provider component for fill ordering (no-op, kept for API compatibility).
 * The actual registry is module-level, so this is not strictly necessary,
 * but kept in case we need to add context-based features later.
 */
export function FillOrderProvider({
	children,
}: {
	children: ReactNode;
}): ReactNode {
	return <>{children}</>;
}
