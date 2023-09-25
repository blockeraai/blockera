/**
 * Internal dependencies
 */
import { SETTINGS_DEFAULTS } from '../../wordpress';

export function getColorValue(color: string): string {
	const colors = SETTINGS_DEFAULTS.colors;

	for (const colorKey in colors) {
		const _color = colors[colorKey];

		if (_color.slug !== color && -1 === color.indexOf(_color.slug)) {
			continue;
		}

		return _color.color;
	}

	return color;
}
