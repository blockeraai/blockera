/**
 * WordPress dependencies
 */
import * as wpIcons from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { isValid, ignoreNullValue } from '../utilities';
import iconDataset from '../../wp/icons.json';

/**
 * Retrieve the icon of WordPress with name.
 *
 * @param {string} iconName
 * @returns {object} icon
 */
export default function getIcon(iconName) {
	const entries = Object.entries(iconDataset);
	const excluded = ['Icon', 'lineDashed', 'lineDotted', 'lineSolid'];

	return (
		entries
			.map((iconItem) => {
				let currentIcon = iconItem[1];

				if ('object' === typeof currentIcon) {
					currentIcon = currentIcon.name;
				}

				if (!isValid(currentIcon, iconDataset, excluded)) {
					return null;
				}

				if (iconName !== currentIcon) {
					return null;
				}

				return wpIcons[currentIcon];
			})
			.filter(ignoreNullValue)[0] ?? null
	);
}
