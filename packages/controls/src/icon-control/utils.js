/**
 * Publisher dependencies
 */
import {
	createStandardIconObject,
	getIconLibraryIcons,
	iconSearch,
	Icon,
	isValidIcon,
} from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

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
					className={controlInnerClassNames(
						'icon-control-icon',
						'library-' + icon.library,
						'icon-' + icon.iconName,
						isCurrentIcon(icon.iconName, icon.library)
							? 'icon-current'
							: ''
					)}
					onClick={(event) =>
						onClick(event, {
							type: 'UPDATE_ICON',
							icon: icon.iconName,
							library: icon.library,
						})
					}
				>
					<Icon library={icon.library} icon={icon} />
				</span>
			);
	}

	return iconsStack;
}
