// @flow

/**
 * External dependencies
 */
import { useState, useLayoutEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	computeInspectorPopoverOffset,
	getInspectorSidebarElement,
	resolvePopoverAnchorElement,
} from './utils';

type UseInspectorPopoverOffsetArgs = {
	explicitAnchor: ?HTMLElement,
	fallbackAnchor: ?HTMLElement,
	placement: string,
	inspectorGap: number,
};

export function useInspectorPopoverOffset({
	explicitAnchor,
	fallbackAnchor,
	placement,
	inspectorGap,
}: UseInspectorPopoverOffsetArgs): number {
	const resolveAnchor = () =>
		resolvePopoverAnchorElement(explicitAnchor, fallbackAnchor);

	const [offset, setOffset] = useState(() =>
		computeInspectorPopoverOffset(resolveAnchor(), placement, inspectorGap)
	);

	useLayoutEffect(() => {
		const updateOffset = () => {
			setOffset(
				computeInspectorPopoverOffset(
					resolveAnchor(),
					placement,
					inspectorGap
				)
			);
		};

		updateOffset();

		const resolvedAnchor = resolveAnchor();

		if (!resolvedAnchor) {
			return;
		}

		const sidebar = getInspectorSidebarElement(resolvedAnchor);
		const resizeObserver = new ResizeObserver(updateOffset);

		if (sidebar) {
			resizeObserver.observe(sidebar);
		}

		window.addEventListener('resize', updateOffset);

		const scrollTarget =
			resolvedAnchor.closest('.interface-complementary-area') ||
			sidebar?.querySelector('.components-panel') ||
			sidebar;

		if (scrollTarget) {
			scrollTarget.addEventListener('scroll', updateOffset, {
				passive: true,
			});
		}

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('resize', updateOffset);

			if (scrollTarget) {
				scrollTarget.removeEventListener('scroll', updateOffset);
			}
		};
	}, [explicitAnchor, fallbackAnchor, placement, inspectorGap]);

	return offset;
}

export function useResolvedPopoverAnchor(
	explicitAnchor: ?HTMLElement,
	fallbackAnchor: ?HTMLElement
): ?HTMLElement {
	const [resolvedAnchor, setResolvedAnchor] = useState<?HTMLElement>(() =>
		resolvePopoverAnchorElement(explicitAnchor, fallbackAnchor)
	);

	useLayoutEffect(() => {
		setResolvedAnchor(
			resolvePopoverAnchorElement(explicitAnchor, fallbackAnchor)
		);
	}, [explicitAnchor, fallbackAnchor]);

	return resolvedAnchor;
}
