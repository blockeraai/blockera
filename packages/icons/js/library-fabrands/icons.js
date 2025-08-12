//@flow

/**
 * External dependencies
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import * as freeBrandsIcons from '@fortawesome/free-brands-svg-icons';

library.add(freeBrandsIcons.fab);

/**
 * Internal dependencies
 */
import { getIconKebabId } from '../helpers';

const FaBrandsIcons: Object = Object.fromEntries(
	Object.entries(freeBrandsIcons)
		.map(([key, value]) => {
			let newKey = getIconKebabId(key);

			switch (newKey) {
				case 'fa-5-0-0px':
					newKey = '500px';
					break;

				case 'fa-1-1ty':
					newKey = '11ty';
					break;

				case 'fa-4-2-group':
					newKey = '42-group';
					break;

				case 'fa-css-3':
					newKey = 'css3';
					break;

				case 'fa-css-3-alt':
					newKey = 'css3-alt';
					break;

				case 'fa-html-5':
					newKey = 'html5';
					break;

				case 'fa-draft-2digital':
					newKey = 'draft2digital';
					break;

				case 'fa-ns-8':
					newKey = 'ns8';
					break;

				case 'fa-page-4':
					newKey = 'page4';
					break;

				case 'fa-typo-3':
					newKey = 'typo3';
					break;

				case 'fa-w-3c':
					newKey = 'w3c';
					break;

				default:
					break;
			}

			return [newKey, value];
		})
		.filter(([key]) => {
			return !['fab', 'prefix'].includes(key);
		})
);

export { FaBrandsIcons };
