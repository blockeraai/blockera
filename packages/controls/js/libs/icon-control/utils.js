/**
 * External dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import {
	Icon,
	iconSearch,
	isValidIcon,
	getIconLibraryIcons,
	createStandardIconObject,
} from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Tooltip } from '../';

export function getLibraryIcons({
	library,
	query,
	onClick = () => {},
	limit = 21,
	isCurrentIcon = () => {
		return false;
	},
}) {
	let iconLibraryIcons = {};
	const iconsStack = [];

	if (library === 'suggestions' || library === 'search') {
		switch (typeof query) {
			case 'function':
				iconLibraryIcons = iconSearch({
					query: query(),
					library: 'all',
					limit,
				});
				break;
			case 'object':
				iconLibraryIcons = query;
				break;
			case 'string':
				iconLibraryIcons = iconSearch({
					query,
					library: 'all',
					limit,
				});
				break;
		}
	} else {
		iconLibraryIcons = getIconLibraryIcons(library);
	}

	for (const iconKey in iconLibraryIcons) {
		const icon = createStandardIconObject(
			iconKey,
			iconLibraryIcons[iconKey]?.library
				? iconLibraryIcons[iconKey]?.library
				: library,
			iconLibraryIcons[iconKey]
		);

		if (isValidIcon(icon, iconKey))
			iconsStack.push(
				<span
					key={iconKey}
					className={controlInnerClassNames(
						'icon-control-icon',
						'library-' + icon.library,
						'icon-' + icon.iconName,
						isCurrentIcon(icon.iconName, icon.library)
							? 'icon-current'
							: ''
					)}
					aria-label={sprintf(
						// translators: %s is icon ID in icon libraries for example arrow-left
						__('%s Icon', 'blockera'),
						icon.iconName
					)}
					onClick={(event) =>
						onClick(event, {
							type: 'UPDATE_ICON',
							icon: icon.iconName,
							library: icon.library,
						})
					}
				>
					<Tooltip text={icon.iconName}>
						<Icon library={icon.library} icon={icon} />
					</Tooltip>
				</span>
			);
	}

	return iconsStack;
}
