/**
 * External dependencies
 */
import * as fasIcons from '@fortawesome/free-solid-svg-icons';

/**
 * Internal dependencies
 */
import iconDataset from '../../fas/icons.json';
import { isValid, ignoreNullValue } from '../utilities';

/**
 * Retrieve the icon from font-awesome solid style.
 *
 * @param {string} iconName
 */
export default function getIcon(iconName: string) {
	const entries = Object.entries(iconDataset);

	return (
		entries
			.map((iconItem) => {
				let currentIcon = iconItem[1];

				if ('object' === typeof currentIcon) {
					currentIcon = currentIcon.name;
				}

				if (!isValid(currentIcon, iconDataset)) {
					return null;
				}

				if (iconName !== currentIcon) {
					return null;
				}

				return fasIcons[iconName];
			})
			.filter(ignoreNullValue)[0] ?? null
	);
}
