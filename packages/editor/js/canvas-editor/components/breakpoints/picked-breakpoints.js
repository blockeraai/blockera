// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from './helpers';
import { BreakpointIcon } from './breakpoint-icon';
import type { PickedBreakpointsComponentProps } from './types';
import { default as defaultBreakpoints } from '../../../extensions/libs/block-states/default-breakpoints';

export default function ({
	onClick,
}: PickedBreakpointsComponentProps): MixedElement {
	const baseBreakpoint = getBaseBreakpoint();
	const [currentActiveBreakpoint, setActiveBreakpoint] =
		useState(baseBreakpoint);

	function activeBreakpoints() {
		const breakpoints = [];

		Object.entries(defaultBreakpoints()).forEach(([itemId, item]) => {
			if (item.status) {
				breakpoints.push(
					<BreakpointIcon
						className={classNames({
							'is-active-breakpoint':
								itemId === currentActiveBreakpoint,
						})}
						name={itemId}
						onClick={(event) => {
							event.stopPropagation();

							onClick(itemId);
							setActiveBreakpoint(itemId);
						}}
					/>
				);
			}
		});

		return breakpoints;
	}

	return (
		<Flex
			className={controlInnerClassNames('blockera-breakpoints')}
			justifyContent={'space-between'}
			alignItems="center"
			aria-label={__('Breakpoints', 'blockera')}
			gap="12px"
		>
			{activeBreakpoints()}
		</Flex>
	);
}
