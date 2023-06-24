/**
 * External dependencies
 */
import { Icon as WordPressIconComponent } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { isString, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';

export function WPIcon({ fixedSizing = false, size, icon, ...props }) {
	if (isString(icon)) {
		icon = getIcon(icon, 'wp');
	}

	if (isString(icon?.icon)) {
		icon = getIcon(icon?.icon ? icon?.icon : icon?.iconName, 'wp');
	}

	if (isUndefined(icon.icon)) {
		return <></>;
	}

	return (
		<WordPressIconComponent
			icon={icon.icon}
			size={!fixedSizing ? size : 22}
			{...props}
		/>
	);
}
