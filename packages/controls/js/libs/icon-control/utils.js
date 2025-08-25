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
import ConditionalWrapper from '../conditional-wrapper';

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

	if (
		'suggestions' === library ||
		'search' === library ||
		'search-2' === library
	) {
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
					library: 'search-2' === library ? 'all2' : 'all',
					limit,
				});
				break;
		}
	} else {
		iconLibraryIcons = getIconLibraryIcons(library);
	}

	const iconType = applyFilters(
		'blockera.controls.iconControl.utils.getLibraryIcons.type',
		['search-2', 'faregular', 'fasolid', 'fabrands'].includes(library)
			? 'native'
			: 'none',
		library
	);

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
				<ConditionalWrapper
					condition={iconType === 'native'}
					wrapper={(children) => (
						<FeatureWrapper
							className={controlInnerClassNames('icon-wrapper')}
							type={iconType}
						>
							{children}
						</FeatureWrapper>
					)}
				>
					<span
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
								iconSize={
									[
										'faregular',
										'fasolid',
										'fabrands',
									].includes(icon.library)
										? 18
										: 24
								}
							/>
						</Tooltip>
					</span>
				</ConditionalWrapper>
			);
	}

	return iconsStack;
}
