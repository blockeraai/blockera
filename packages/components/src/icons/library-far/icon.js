// Load FA icons and register to library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getIcon } from '../index';

export function FontAwesomeIconFar({
	icon,
	size,
	uploadedSVG,
	fixedSizing = false,
	...props
}) {
	if (typeof icon === 'string') {
		icon = getIcon(icon, 'far');
	}

	if (typeof icon.icon === 'undefined') {
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
