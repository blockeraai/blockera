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
import { FaSolidIcons } from './icons';

export function FaSolidIcon({
	library = 'fasolid',
	style = {},
	iconSize = 20,
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
		style.width = `${iconSize}px`;
		style.height = `${iconSize}px`;
	}

	if (!FaSolidIcons[icon.iconName]) {
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
