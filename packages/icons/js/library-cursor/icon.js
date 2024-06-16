//@flow

/**
 * External Dependencies
 */
import { Icon as WordPressIconComponent } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';
import type { IconProps } from '../types';

export function CursorIcon({
	icon,
	iconSize = 20,
	...props
}: IconProps): MixedElement {
	if (isString(icon)) {
		icon = getIcon(icon, 'cursor');
	}

	//$FlowFixMe
	if (isUndefined(icon?.icon)) {
		return <></>;
	}

	//$FlowFixMe
	delete props.size;

	if (iconSize) {
		if (!props?.width) {
			props.width = iconSize;
		}

		if (!props?.height) {
			props.height = iconSize;
		}
	}

	return (
		<WordPressIconComponent
			icon={icon.icon}
			width={iconSize}
			height={iconSize}
			{...props}
		/>
	);
}
