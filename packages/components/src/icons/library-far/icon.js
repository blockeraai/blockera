/**
 * External Dependencies
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Publisher Dependencies
 */
import { isString, isUndefined } from '@publisher/utils';

/**
 * Internal Dependencies
 */
import { getIcon } from '../index';

export function FontAwesomeIconFar({
	icon,
	size,
	uploadedSVG,
	fixedSizing = false,
	...props
}) {
	if (isString(icon)) {
		icon = getIcon(icon, 'far');
	}

	if (isUndefined(icon.icon)) {
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
