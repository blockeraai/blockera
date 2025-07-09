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
							settings={item.settings}
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
			gap="5px"
		>
			{activeBreakpoints()}
		</Flex>
	);
}
