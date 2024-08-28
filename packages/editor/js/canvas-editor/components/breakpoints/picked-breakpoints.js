// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

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
import { pascalCase } from '@blockera/utils';

export default function ({
	onClick,
	updaterDeviceIndicator,
}: PickedBreakpointsComponentProps): MixedElement {
	const { __experimentalSetPreviewDeviceType } =
		dispatch('core/edit-post') || dispatch('core/edit-site') || {};
	const { getBreakpoints } = select('blockera/editor');
	const availableBreakpoints: { [key: TBreakpoint]: BreakpointTypes } =
		getBreakpoints();
	const baseBreakpoint = getBaseBreakpoint();
	const [currentActiveBreakpoint, setActiveBreakpoint] =
		useState(baseBreakpoint);

	useEffect(() => {
		updaterDeviceIndicator(setActiveBreakpoint);
		// eslint-disable-next-line
	}, []);

	function activeBreakpoints() {
		const breakpoints = [];

		Object.entries(availableBreakpoints).forEach(
			([itemId, item]: [TBreakpoint, BreakpointTypes], index: number) => {
				if (item.status) {
					breakpoints.push(
						<BreakpointIcon
							key={`${itemId}-${index}`}
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

									// TODO: in this on click handler we need to do set other breakpoints as "previewDeviceType" in future like available breakpoints on WordPress,
									// because WordPress is not support our all breakpoints.
									// We should update WordPress "edit-post" store state for "previewDeviceType" property,
									// because if registered one block type with apiVersion < 3, block-editor try to rendering blocks out of iframe element,
									// so we need to set "previewDeviceType" to rendering blocks inside iframe element and we inject css generated style into iframe,
									// for responsive reasons.
									if (
										'function' ===
										typeof __experimentalSetPreviewDeviceType
									) {
										__experimentalSetPreviewDeviceType(
											pascalCase(itemId)
										);
									}
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
