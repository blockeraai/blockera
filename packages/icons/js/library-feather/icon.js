/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';
import { StrokeSvgIcon } from '../components/stroke-svg-icon';

export function FeatherIcon({
	library = 'feather',
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

	if (icon?.iconName && (!icon?.icon || !icon?.icon?.toSvg)) {
		icon = getIcon(icon.iconName, library);
	}

	if (isUndefined(icon?.icon) || !icon?.icon?.toSvg) {
		return <></>;
	}

	const svg = icon.icon.toSvg({
		width: iconSize,
		height: iconSize,
		'stroke-width': 2,
	});

	return (
		<StrokeSvgIcon svg={svg} iconSize={iconSize} style={style} {...props} />
	);
}
