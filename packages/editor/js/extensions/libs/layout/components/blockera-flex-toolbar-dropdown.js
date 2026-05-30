// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToolbarGroup } from '@wordpress/components';
import type { MixedElement } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import {
	getEmptyToolbarIconForControls,
	type BlockeraFlexToolbarControl,
} from './flex-toolbar-control-config';
import '../style.scss';

export const BLOCKERA_FLEX_TOOLBAR_DROPDOWN_CLASS =
	'blockera-flex-toolbar-dropdown';

const TOOLBAR_TOGGLE_ICON_SIZE = 24;
const TOOLBAR_MENU_ICON_SIZE = 20;

const ICON_ROTATION_TRANSITION = 'transform 0.45s cubic-bezier(0, 0, 0.2, 1)';

/**
 * Match LayoutMatrixControl column icon rotation
 * (layout-matrix-control/style.scss).
 */
const getToolbarIconTransform = (
	iconName: string,
	direction: string
): ?string => {
	if ('column' !== direction) {
		return undefined;
	}

	if (iconName.startsWith('justify-content-')) {
		return 'rotate(90deg)';
	}

	if (iconName.startsWith('flex-align-')) {
		return 'rotate(-90deg)';
	}

	return undefined;
};

const BlockeraToolbarIcon = ({
	iconName,
	direction,
	iconSize,
}: {
	iconName: string,
	direction: string,
	iconSize: number,
}): MixedElement => {
	const transform = getToolbarIconTransform(iconName, direction);

	return (
		<Icon
			icon={iconName}
			iconSize={iconSize}
			className="blockera-flex-toolbar-icon"
			style={{
				transition: ICON_ROTATION_TRANSITION,
				...(transform ? { transform } : {}),
			}}
		/>
	);
};

export const BlockeraFlexToolbarDropdown = ({
	direction,
	value,
	onChange,
	controls,
}: {
	direction: string,
	value: ?string,
	onChange: (?string) => void,
	controls: BlockeraFlexToolbarControl[],
}): MixedElement | null => {
	const emptyIcon = useMemo(
		() => getEmptyToolbarIconForControls(controls),
		[controls]
	);
	const activeControl = value
		? controls.find((control) => control.name === value)
		: undefined;
	const activeIconName = activeControl?.icon ?? emptyIcon;
	const activeLabel = activeControl?.title ?? __('Empty', 'blockera');

	const activeIcon = useMemo(
		() =>
			function ActiveToolbarIcon(): MixedElement {
				return (
					<BlockeraToolbarIcon
						iconName={activeIconName}
						direction={direction}
						iconSize={TOOLBAR_TOGGLE_ICON_SIZE}
					/>
				);
			},
		[activeIconName, direction]
	);

	if (!controls.length) {
		return null;
	}

	return (
		<ToolbarGroup
			className={BLOCKERA_FLEX_TOOLBAR_DROPDOWN_CLASS}
			icon={activeIcon}
			label={activeLabel}
			isCollapsed
			controls={controls.map((control) => ({
				icon: function ControlIcon(): MixedElement {
					return (
						<BlockeraToolbarIcon
							iconName={control.icon}
							direction={direction}
							iconSize={TOOLBAR_MENU_ICON_SIZE}
						/>
					);
				},
				title: control.title,
				isActive: value === control.name,
				onClick: () =>
					onChange(value === control.name ? undefined : control.name),
			}))}
			toggleProps={{
				style: {
					padding: 0,
				},
			}}
		/>
	);
};
