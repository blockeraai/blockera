/**
 * External Dependencies
 */
import { Icon as WordPressIconComponent } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';

export function Icon({
	fixedSizing = false,
	style = {},
	size,
	icon,
	...props
}) {
	if (isString(icon)) {
		icon = getIcon(icon, 'blockera');
	}

	if (isUndefined(icon.icon)) {
		return <></>;
	}

	return (
		<WordPressIconComponent
			style={style}
			icon={icon.icon}
			size={!fixedSizing ? size : 22}
			{...props}
		/>
	);
}
