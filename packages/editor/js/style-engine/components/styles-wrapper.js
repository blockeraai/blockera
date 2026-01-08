// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	createPortal,
} from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { getIframeTag } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { Observer } from '../../observer';

/**
 * Gets or creates the styles wrapper element in the target container.
 *
 * @param {HTMLElement} target The target container element
 * @param {string} slotName The ID for the wrapper element
 * @return {HTMLElement|null} The wrapper element or null if target is invalid
 */
const getOrCreateWrapperElement = (
	target: HTMLElement,
	slotName: string
): HTMLElement | null => {
	if (!target) {
		return null;
	}

	// Check if wrapper already exists
	// Using querySelector to search within the target element's descendants
	const existingWrapper = target.querySelector(`#${slotName}`);
	if (existingWrapper) {
		return existingWrapper;
	}

	// Create new wrapper element
	const wrapper = document.createElement('div');
	wrapper.id = slotName;
	target.append(wrapper);

	return wrapper;
};

/**
 * Gets the target container element (iframe body or fallback).
 *
 * @return {HTMLElement|null} The target container element
 */
const getTargetContainer = (): HTMLElement | null => {
	return (
		getIframeTag('body') ||
		document.querySelector(
			'.interface-navigable-region.interface-interface-skeleton__content'
		)
	);
};

/**
 * StylesWrapper component that renders styles in a portal within the iframe or editor.
 * Uses IntersectionObserver to detect when the target container is available.
 *
 * @param {Object} props Component props
 * @param {string} props.clientId Unique identifier for the block/client
 * @param {MixedElement} props.children Content to render in the portal
 * @param {boolean} props.isGlobalStylesWrapper Whether this is for global styles
 * @return {MixedElement} The rendered component
 */
export const StylesWrapper = ({
	children,
	clientId,
	isGlobalStylesWrapper = false,
}: {
	clientId: string,
	children: MixedElement,
	isGlobalStylesWrapper?: boolean,
}): MixedElement => {
	// Memoize slot name to avoid recalculation on every render
	const slotName = useMemo(
		() =>
			isGlobalStylesWrapper
				? 'blockera-global-styles-wrapper'
				: 'blockera-styles-wrapper',
		[isGlobalStylesWrapper]
	);

	// State for the portal container element
	const [entry, setEntry] = useState<HTMLElement | null>(null);

	// Memoize the observer callback to prevent unnecessary re-renders
	// Uses ref-like pattern to avoid unnecessary state updates if entry already matches
	const handleIntersection = useCallback(
		(entries: Array<IntersectionObserverEntry>) => {
			const target = entries[0]?.target;
			if (!target || !(target instanceof HTMLElement)) {
				return;
			}

			const wrapper = getOrCreateWrapperElement(target, slotName);
			if (wrapper) {
				setEntry(wrapper);
			}
		},
		[slotName]
	);

	// Memoize iframe body element to avoid repeated queries
	const iframeBodyElement = useMemo(
		(): HTMLElement | void => getIframeTag('body'),
		[]
	);

	// Memoize observer configuration to prevent recreation on every render
	// Use document.body directly instead of querySelector for better performance
	const observerConfig = useMemo(
		() => [
			{
				options: {
					root: document.body,
					threshold: 1.0,
				},
				callback: handleIntersection,
				target: iframeBodyElement,
			},
		],
		[handleIntersection, iframeBodyElement]
	);

	// Initialize wrapper element on mount if target is already available
	useEffect(() => {
		const target = getTargetContainer();
		if (target) {
			const wrapper = getOrCreateWrapperElement(target, slotName);
			if (wrapper) {
				setEntry(wrapper);
			}
		}
	}, [slotName]);

	return (
		<Observer ancestors={observerConfig}>
			{entry &&
				createPortal(
					<SlotFillProvider>
						<Slot name={`${slotName}-${clientId}`} />
						{children}
					</SlotFillProvider>,
					entry
				)}
		</Observer>
	);
};
