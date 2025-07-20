// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { PickedBreakpointsComponentProps } from './types';
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../extensions/libs/block-card/block-states/types';
import { getBaseBreakpoint, getSortedBreakpoints } from './helpers';
import { useExtensionsStore } from '../../../hooks/use-extensions-store';

export default function ({
	items,
	onClick,
	updateBlock,
	updaterDeviceIndicator,
}: PickedBreakpointsComponentProps): MixedElement {
	const { setCurrentBreakpoint } = useExtensionsStore();
	const availableBreakpoints: { [key: TBreakpoint]: BreakpointTypes } = items;
	const baseBreakpoint = getBaseBreakpoint();
	const [currentActiveBreakpoint, setActiveBreakpoint] =
		useState(baseBreakpoint);

	useEffect(() => {
		updaterDeviceIndicator(setActiveBreakpoint);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		updateBlock(currentActiveBreakpoint);
		setCurrentBreakpoint(currentActiveBreakpoint);
		// eslint-disable-next-line
	}, [currentActiveBreakpoint]);

	const breakpoints = getSortedBreakpoints(availableBreakpoints, {
		onClick,
		output: 'icons',
		setActiveBreakpoint,
		currentActiveBreakpoint,
	}); // calculate the gap based on the number of breakpoints

	// Calculate gap based on number of breakpoints
	const getGap = () => {
		if (breakpoints.length >= 7) {
			return '5px';
		}

		if (breakpoints.length >= 5) {
			return '8px';
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
