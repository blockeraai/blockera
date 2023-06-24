/**
 * External Dependencies
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

export function PublisherIcon({ fixedSizing = false, size, icon, ...props }) {
	if (isString(icon)) {
		icon = getIcon(icon, 'publisher');
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
