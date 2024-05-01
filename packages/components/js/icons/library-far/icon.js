/**
 * External Dependencies
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 *  Dependencies
 */
import { isString, isUndefined } from '@blockera/utils';

/**
 * Internal Dependencies
 */
import { getIcon } from '../index';

export function FontAwesomeIconFar({
	icon,
	size,
	uploadedSVG,
	style = {},
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
							...style,
							width: `${size}px`,
							height: `${size}px`,
					  }
					: style
			}
		/>
	);
}
