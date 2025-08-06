/**
 * External dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

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
import { FeatureWrapper } from '../feature-wrapper';

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
				<FeatureWrapper
					className={controlInnerClassNames('icon-wrapper')}
					type={applyFilters(
						'blockera.controls.iconControl.utils.getLibraryIcons.type',
						'fontawesome' === library ? 'native' : 'none',
						library
					)}
				>
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
							<Icon
								library={icon.library}
								icon={icon}
								iconSize={'fontawesome' === library ? 20 : 24}
							/>
						</Tooltip>
					</span>
				</FeatureWrapper>
			);
	}

	return iconsStack;
}
