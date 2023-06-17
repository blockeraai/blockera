// Load FA icons and register to library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getIcon } from '../index';

export function FontAwesomeIconFas({
	size,
	icon,
	uploadedSVG,
	fixedSizing = false,
	...props
}) {
	if (typeof icon === 'string') {
		icon = getIcon(icon, 'fas');
	}

	if (!icon?.icon) {
		return <></>;
	}

	return (
		<FontAwesomeIcon
			{...props}
			icon={icon.icon}
			style={
				!fixedSizing
					? {
							width: `${size}px`,
							height: `${size}px`,
					  }
					: ''
			}
		/>
	);
}
