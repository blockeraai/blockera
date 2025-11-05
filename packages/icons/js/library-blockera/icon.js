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

export function BlockeraIcon({
	library = 'blockera',
	icon,
	iconSize = 20,
	...props
}: IconProps): MixedElement {
	if (isString(icon)) {
		icon = getIcon(icon, library);
	}

	//$FlowFixMe
	if (isUndefined(icon?.icon)) {
		return <></>;
	}

	//$FlowFixMe
	delete props.size;

	if (iconSize) {
		props.width = iconSize;
		props.height = iconSize;
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
