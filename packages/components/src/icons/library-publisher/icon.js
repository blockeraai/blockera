import { getIcon } from '../index';
import { Icon as WordPressIconComponent } from '@wordpress/components';

export function PublisherIcon({ fixedSizing = false, size, icon, ...props }) {
	if (typeof icon === 'string') {
		icon = getIcon(icon, 'publisher');
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
