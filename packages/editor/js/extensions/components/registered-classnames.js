// @flow

/**
 * Internal dependencies
 */
import { getSmallHash } from '@blockera/utils';

// Map to store registered class names by clientId.
// Structure: Map<clientId, Set<classNames>>
const REGISTERED_CLASSNAMES = new Map<string, Set<string>>();

// blockera block classname pattern.
export const BLOCKERA_BLOCK_REGEX: RegExp = /blockera-block-[\w-]+/i;

/**
 * Register a class name to be used in the block.
 *
 * @param {string} clientId - The client ID of the block.
 * @param {string} className - The class name to register.
 */
export const registerClassName = (
	clientId: string,
	className: string
): void => {
	if (!REGISTERED_CLASSNAMES.has(clientId)) {
		REGISTERED_CLASSNAMES.set(clientId, new Set());
	}
	REGISTERED_CLASSNAMES.get(clientId)?.add(className);
};

/**
 * Unregister a class name from a block. Used when block unmounts.
 *
 * @param {string} clientId - The client ID of the block.
 * @param {string} className - The class name to unregister.
 */
export const unregisterClassName = (
	clientId: string,
	className: string
): void => {
	const classNames = REGISTERED_CLASSNAMES.get(clientId);
	if (classNames) {
		classNames.delete(className);
		if (classNames.size === 0) {
			REGISTERED_CLASSNAMES.delete(clientId);
		}
	}
};

/**
 * Check if a class name is already registered for a different clientId.
 *
 * @param {string} clientId - The client ID of the block.
 * @param {string} className - The class name to check.
 * @return {boolean} True if the class name is registered for a different clientId.
 */
export const isClassNameDuplicate = (
	clientId: string,
	className: string
): boolean => {
	for (const [
		registeredClientId,
		classNames,
	] of REGISTERED_CLASSNAMES.entries()) {
		if (registeredClientId !== clientId && classNames.has(className)) {
			return true;
		}
	}
	return false;
};

/**
 * Check if a class name is registered for any clientId.
 *
 * @param {string} className - The class name to check.
 * @return {boolean} True if the class name is registered.
 */
export const hasRegisteredClassName = (className: string): boolean => {
	for (const classNames of REGISTERED_CLASSNAMES.values()) {
		if (classNames.has(className)) {
			return true;
		}
	}
	return false;
};

/**
 * Remove a class name from the registry (from all clientIds).
 *
 * @param {string} className - The class name to remove.
 */
export const removeRegisteredClassName = (className: string): void => {
	REGISTERED_CLASSNAMES.forEach((classNames, clientId) => {
		classNames.delete(className);
		if (classNames.size === 0) {
			REGISTERED_CLASSNAMES.delete(clientId);
		}
	});
};

/**
 * Get all registered class names for a specific clientId.
 *
 * @param {string} clientId - The client ID of the block.
 * @return {Set<string>} Set of registered class names for the clientId.
 */
export const getRegisteredClassNames = (clientId: string): Set<string> => {
	return REGISTERED_CLASSNAMES.get(clientId) || new Set();
};

/**
 * Clear all registered class names. Used when switching to text editor mode
 * to reset the registry since blocks are not rendered in that mode.
 */
export const clearRegisteredClassNames = (): void => {
	REGISTERED_CLASSNAMES.clear();
};

/**
 * Generate a unique class name for a block instance.
 * Handles collisions by detecting existing numbered classnames and appending
 * a counter based on the highest number found.
 *
 * @param {string} clientId - The client ID to generate the unique class name from.
 * @param {string} className - The default class name for block.
 *
 * @return {string} A unique class name that hasn't been registered yet.
 */
export const generateUniqueClassName = (
	clientId: string,
	className: string
): string => {
	let _className = '';
	const matchBaseClass = className?.match(BLOCKERA_BLOCK_REGEX);
	if (matchBaseClass) {
		_className = matchBaseClass[0];
	}
	const baseHash = _className
		? _className.match(/blockera-block-(\w+)/)?.[1] ||
			getSmallHash(clientId)
		: getSmallHash(clientId);
	const baseClassName = _className
		? _className
		: `blockera-block-${baseHash}`;

	// Check if base classname is available (no counter needed).
	if (!isClassNameDuplicate(clientId, baseClassName)) {
		registerClassName(clientId, baseClassName);
		return baseClassName;
	}

	// Base classname exists, find the highest counter number used.
	// Pattern: blockera-block-{baseHash}-{number}
	const pattern = new RegExp(
		`^blockera-block-${baseHash.replace(
			/[.*+?^${}()|[\]\\]/g,
			'\\$&'
		)}-(\\d+)$`
	);
	let maxCounter = 0;

	// Scan all registered classnames to find the highest counter for this baseHash.
	REGISTERED_CLASSNAMES.forEach((registeredClassNames) => {
		registeredClassNames.forEach((registeredClassName) => {
			// $FlowFixMe
			const match = registeredClassName.match(pattern);
			if (match) {
				const counter = parseInt(match[1], 10);
				if (counter > maxCounter) {
					maxCounter = counter;
				}
			}
		});
	});

	// Generate unique classname with counter starting from maxCounter + 1.
	let counter = maxCounter + 1;
	let uniqueClassName = `blockera-block-${baseHash}-${counter}`;

	// Double-check for collisions (shouldn't happen, but safety check).
	while (hasRegisteredClassName(uniqueClassName)) {
		counter++;
		uniqueClassName = `blockera-block-${baseHash}-${counter}`;
	}

	// Register the class name to prevent future collisions.
	registerClassName(clientId, uniqueClassName);

	return uniqueClassName;
};
