// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
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
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../extensions/libs/block-states/types';

export default function ({
	onClick,
}: PickedBreakpointsComponentProps): MixedElement {
	const { getBreakpoints } = select('blockera/editor');
	const availableBreakpoints: { [key: TBreakpoint]: BreakpointTypes } =
		getBreakpoints();
	const baseBreakpoint = getBaseBreakpoint();
	const [currentActiveBreakpoint, setActiveBreakpoint] =
		useState(baseBreakpoint);

	function activeBreakpoints() {
		const breakpoints = [];

		Object.entries(availableBreakpoints).forEach(
			([itemId, item]: [TBreakpoint, BreakpointTypes]) => {
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

								if (itemId !== currentActiveBreakpoint) {
									onClick(itemId);
									setActiveBreakpoint(itemId);
								}
							}}
						/>
					);
				}
			}
		);

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
