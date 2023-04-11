/**
 * Internal dependencies
 */
import * as publisherIcons from '../../../../icon-library/@publisher';
import iconDataset from '../../publisher/icons.json';
import { isValid, ignoreNullValue } from '../utilities';

/**
 * Retrieve the icon of Publisher with name.
 *
 * @param {string} iconName
 * @returns {object} icon
 */
export default function publisher(iconName) {
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

				return publisherIcons[currentIcon];
			})
			.filter(ignoreNullValue)[0] ?? null
	);
}
