/**
 * External dependencies
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';

export function FontAwesomeIconFas({
	size,
	icon,
	uploadedSVG,
	style = {},
	fixedSizing = false,
	...props
}) {
	if (isString(icon)) {
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
							...style,
							width: `${size}px`,
							height: `${size}px`,
					  }
					: style
			}
		/>
	);
}
