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
 * Collect blockera class names from all blocks in the editor store.
 * Used to detect duplicates from block attributes (input) before registration.
 *
 * @param {Function} getBlocks - Function that returns root blocks from the editor.
 * @param {Function} getBlockAttributes - Function that returns attributes for a clientId.
 * @return {Map<string, Set<string>>} Map of clientId -> Set of blockera class names.
 */
export const getBlocksClassNamesFromStore = (
	getBlocks: () => Array<{ clientId: string, innerBlocks?: Array<any> }>,
	getBlockAttributes: (clientId: string) => { className?: string }
): Map<string, Set<string>> => {
	const map = new Map<string, Set<string>>();
	const regex = new RegExp(BLOCKERA_BLOCK_REGEX.source, 'gi');

	function collect(
		blocks: ?Array<{ clientId: string, innerBlocks?: Array<any> }>
	) {
		if (!blocks) {
			return;
		}
		for (const block of blocks) {
			const attrs = getBlockAttributes(block.clientId) || {};
			const className = attrs.className || '';
			const matches = className.match(regex);
			if (matches) {
				if (!map.has(block.clientId)) {
					map.set(block.clientId, new Set());
				}
				const set = map.get(block.clientId);
				if (set) {
					matches.forEach((cn: string) => set.add(cn));
				}
			}
			if (block.innerBlocks?.length) {
				collect(block.innerBlocks);
			}
		}
	}
	collect(getBlocks());
	return map;
};

/**
 * Check if a class name is already used by a different clientId.
 * Checks both the registry and block attributes from the editor store.
 *
 * @param {string} clientId - The client ID of the block.
 * @param {string} className - The class name to check.
 * @param {Map<string, Set<string>>} [blocksClassNames] - Optional map of clientId -> blockera class names from block attributes.
 * @return {boolean} True if the class name is used by a different clientId.
 */
export const isClassNameDuplicate = (
	clientId: string,
	className: string,
	blocksClassNames?: Map<string, Set<string>>
): boolean => {
	// Check registered class names.
	for (const [
		registeredClientId,
		classNames,
	] of REGISTERED_CLASSNAMES.entries()) {
		if (registeredClientId !== clientId && classNames.has(className)) {
			return true;
		}
	}
	// Also check block attributes (input) when other blocks have this className.
	if (blocksClassNames) {
		for (const [blockClientId, classNames] of blocksClassNames.entries()) {
			if (blockClientId !== clientId && classNames.has(className)) {
				return true;
			}
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
 * @param {Map<string, Set<string>>} [blocksClassNames] - Optional map of clientId -> blockera class names from block attributes.
 *
 * @return {string} A unique class name that hasn't been registered yet.
 */
export const generateUniqueClassName = (
	clientId: string,
	className: string,
	blocksClassNames?: Map<string, Set<string>>
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
	if (!isClassNameDuplicate(clientId, baseClassName, blocksClassNames)) {
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

	const scanForCounter = (className: string) => {
		// $FlowFixMe
		const match = className.match(pattern);
		if (match) {
			const n = parseInt(match[1], 10);
			if (n > maxCounter) {
				maxCounter = n;
			}
		}
	};

	// Scan registered classnames.
	REGISTERED_CLASSNAMES.forEach((registeredClassNames) => {
		registeredClassNames.forEach(scanForCounter);
	});
	// Also scan block attributes.
	if (blocksClassNames) {
		blocksClassNames.forEach((classNames) =>
			classNames.forEach(scanForCounter)
		);
	}

	// Generate unique classname with counter starting from maxCounter + 1.
	let counter = maxCounter + 1;
	let uniqueClassName = `blockera-block-${baseHash}-${counter}`;

	// Double-check for collisions (registry and block attributes).
	const isClassNameTaken = (cn: string) => {
		if (hasRegisteredClassName(cn)) {
			return true;
		}
		if (blocksClassNames) {
			for (const [
				blockClientId,
				classNames,
			] of blocksClassNames.entries()) {
				if (blockClientId !== clientId && classNames.has(cn)) {
					return true;
				}
			}
		}
		return false;
	};
	while (isClassNameTaken(uniqueClassName)) {
		counter++;
		uniqueClassName = `blockera-block-${baseHash}-${counter}`;
	}

	// Register the class name to prevent future collisions.
	registerClassName(clientId, uniqueClassName);

	return uniqueClassName;
};
