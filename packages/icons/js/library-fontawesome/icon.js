/**
 * External dependencies
 */
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';

/**
 * Blockera dependencies
 */
import { isString, isUndefined, snakeCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';
import { FaIcons } from './icons';

export function FontAwesomeIcon({
	library = 'fontawesome',
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
			style.width = `${iconSize}px`;
		}

		if (!props?.height) {
			style.height = `${iconSize}px`;
		}
	}

	if (!FaIcons[icon.iconName]) {
		icon.iconName = snakeCase(icon.iconName).replace(/_/g, '-');
	}

	// Handle regular and solid icons
	return (
		<FaIcon
			style={style}
			icon={[icon.icon.prefix, icon.iconName]}
			{...props}
		/>
	);
}
