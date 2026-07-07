/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';
import { StrokeSvgIcon } from '../components/stroke-svg-icon';

export function TablerIcon({
	library = 'tabler',
	style = {},
	iconSize = 20,
	icon,
	...props
}) {
	if (isString(icon)) {
		icon = getIcon(icon, library);
	}

	if (isString(icon?.icon) && !icon.icon.trim().startsWith('<')) {
		icon = getIcon(icon.icon, library);
	}

	if (
		icon?.iconName &&
		(typeof icon?.icon !== 'string' || !icon.icon.trim().startsWith('<'))
	) {
		icon = getIcon(icon.iconName, library);
	}

	if (isUndefined(icon?.icon) || typeof icon?.icon !== 'string') {
		return <></>;
	}

	return (
		<StrokeSvgIcon
			svg={icon.icon}
			iconSize={iconSize}
			style={style}
			{...props}
		/>
	);
}
