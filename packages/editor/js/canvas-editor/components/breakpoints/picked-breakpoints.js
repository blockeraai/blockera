// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { pascalCase } from '@blockera/utils';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from './helpers';
import { BreakpointIcon } from './breakpoint-icon';
import type { PickedBreakpointsComponentProps } from './types';
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../extensions/libs/block-card/block-states/types';
import { useExtensionsStore } from '../../../hooks/use-extensions-store';

export default function ({
	items,
	onClick,
	updateBlock,
	updaterDeviceIndicator,
}: PickedBreakpointsComponentProps): MixedElement {
	const { setDeviceType } = dispatch('core/editor');
	const { setCurrentBreakpoint } = useExtensionsStore();
	const availableBreakpoints: { [key: TBreakpoint]: BreakpointTypes } = items;
	const baseBreakpoint = getBaseBreakpoint();
	const [currentActiveBreakpoint, setActiveBreakpoint] =
		useState(baseBreakpoint);

	const wpExperimentalSetDevicePreview = (itemId: TBreakpoint): void => {
		// TODO: in this on click handler we need to do set other breakpoints as "previewDeviceType" in future like available breakpoints on WordPress,
		// because WordPress is not support our all breakpoints.
		// We should update WordPress "edit-post" store state for "previewDeviceType" property,
		// because if registered one block type with apiVersion < 3, block-editor try to rendering blocks out of iframe element,
		// so we need to set "previewDeviceType" to rendering blocks inside iframe element and we inject css generated style into iframe,
		// for responsive reasons.
		if ('function' === typeof setDeviceType) {
			setDeviceType(pascalCase(itemId));
		}
	};

	useEffect(() => {
		updaterDeviceIndicator(setActiveBreakpoint);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		updateBlock(currentActiveBreakpoint);
		setCurrentBreakpoint(currentActiveBreakpoint);
		wpExperimentalSetDevicePreview(currentActiveBreakpoint);
		// eslint-disable-next-line
	}, [currentActiveBreakpoint]);

	function activeBreakpoints() {
		const breakpoints = [];

		// Helper function to extract numeric value from px string
		const extractNumericValue = (value: string): number => {
			if (!value || value.includes('func')) return -1;
			return parseInt(value.replace('px', ''), 10) || 0;
		};

		// Helper function to determine breakpoint category and sort value
		const getBreakpointSortInfo = (item: BreakpointTypes) => {
			const { min, max } = item.settings;
			const minValue = extractNumericValue(min);
			const maxValue = extractNumericValue(max);
			const hasMin = min && minValue >= 0;
			const hasMax = max && maxValue >= 0;
			const hasFunc =
				(min && min.includes('func')) || (max && max.includes('func'));

			// Base breakpoint should be in center (category 2)
			if (item.base) {
				return { category: 2, sortValue: 0 };
			}

			// Items with "func" should be at the very end (category 5)
			if (hasFunc) {
				return { category: 5, sortValue: 0 };
			}

			// Items with both min and max should be at the end (category 4)
			if (hasMin && hasMax) {
				return { category: 4, sortValue: maxValue };
			}

			// Items with only min should be first (category 1), larger values first
			if (hasMin && !hasMax) {
				return { category: 1, sortValue: -minValue }; // Negative for descending order
			}

			// Items with only max should be at the end (category 3), larger values at the end
			if (!hasMin && hasMax) {
				return { category: 3, sortValue: -maxValue }; // Negative for ascending order (small to large)
			}

			// Fallback for items with no min/max
			return { category: 3, sortValue: 0 };
		};

		// Convert to array and sort
		const sortedBreakpoints = Object.entries(availableBreakpoints)
			.filter(([, item]: [TBreakpoint, BreakpointTypes]) => item.status)
			.map(([itemId, item]: [TBreakpoint, BreakpointTypes]) => {
				const sortInfo = getBreakpointSortInfo(item);
				return {
					itemId,
					item,
					...sortInfo,
				};
			})
			.sort((a, b) => {
				// First sort by category
				if (a.category !== b.category) {
					return a.category - b.category;
				}
				// Then sort by sortValue within the same category
				return a.sortValue - b.sortValue;
			});

		// Create breakpoint components in sorted order
		sortedBreakpoints.forEach(({ itemId, item }, index: number) => {
			breakpoints.push(
				<BreakpointIcon
					key={`${itemId}-${index}`}
					className={classNames({
						'is-active-breakpoint':
							itemId === currentActiveBreakpoint,
					})}
					name={itemId}
					settings={{
						...item.settings,
						min: item.settings.min || '',
						max: item.settings.max || '',
					}}
					isDefault={item.isDefault}
					onClick={(event) => {
						event.stopPropagation();

						if (itemId !== currentActiveBreakpoint) {
							onClick(itemId);
							setActiveBreakpoint(itemId);

							wpExperimentalSetDevicePreview(itemId);
						}
					}}
				/>
			);
		});

		return breakpoints;
	}

	const breakpoints = activeBreakpoints(); // calculate the gap based on the number of breakpoints

	// Calculate gap based on number of breakpoints
	const getGap = () => {
		if (breakpoints.length >= 5) {
			return '5px';
		}

		if (breakpoints.length > 3) {
			return '10px';
		}

		return '12px';
	};

	return (
		<Flex
			className={controlInnerClassNames('blockera-breakpoints')}
			justifyContent={'space-between'}
			alignItems="center"
			aria-label={__('Breakpoints', 'blockera')}
			gap={getGap()}
		>
			{breakpoints}
		</Flex>
	);
}
