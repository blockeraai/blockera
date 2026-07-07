/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getIcon } from '../index';

export function UntitleduiIcon({
	library = 'untitledui',
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

	if (icon?.iconName && typeof icon?.icon !== 'function') {
		icon = getIcon(icon.iconName, library);
	}

	if (isUndefined(icon?.icon) || typeof icon?.icon !== 'function') {
		return <></>;
	}

	const IconComponent = icon.icon;

	return (
		<span
			className="blockera-stroke-svg-icon"
			style={{ color: props?.style?.color || 'currentColor' }}
		>
			<IconComponent size={iconSize} {...props} />
		</span>
	);
}
