/**
 * External dependencies
 */
import { Icon as WordPressIconComponent } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';

export function WPIcon({
	library = 'wp',
	style = {},
	iconSize = 24,
	icon,
	...props
}) {
	if (isString(icon)) {
		icon = getIcon(icon, library);
	}

	if (isString(icon?.icon)) {
		icon = getIcon(icon?.icon ? icon?.icon : icon?.iconName, library);
	}

	if (isUndefined(icon?.icon)) {
		return <></>;
	}

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
			style={style}
			icon={icon.icon}
			{...props}
			size={iconSize}
		/>
	);
}
