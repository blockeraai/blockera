// Load WP icons
import { Icon as WordPressIconComponent } from '@wordpress/components';

import { getIcon } from '../index';

export function WPIcon({ fixedSizing = false, size, icon, ...props }) {
	if (typeof icon === 'string') {
		icon = getIcon(icon, 'wp');
	}

	if (typeof icon?.icon === 'string') {
		icon = getIcon(icon?.icon ? icon?.icon : icon?.iconName, 'wp');
	}

	if (typeof icon.icon === 'undefined') {
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
