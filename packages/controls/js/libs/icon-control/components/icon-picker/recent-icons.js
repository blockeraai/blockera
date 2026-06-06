/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { IconContext } from '../../context';
import { buildRecentIconElements } from '../../utils';

export default function RecentIcons() {
	const { recentIcons, removeRecentIcon, handleIconSelect, isCurrentIcon } =
		useContext(IconContext);

	const iconElements = useMemo(
		() =>
			buildRecentIconElements({
				items: recentIcons,
				onSelect: handleIconSelect,
				onRemove: removeRecentIcon,
				isCurrentIcon,
			}),
		[recentIcons, handleIconSelect, removeRecentIcon, isCurrentIcon]
	);

	if (!iconElements.length) {
		return null;
	}

	return (
		<div
			className={controlInnerClassNames(
				'icon-library',
				'library-recent',
				'icon-picker-recent-icons',
				'is-rendered'
			)}
		>
			<div className={controlInnerClassNames('library-header')}>
				<Icon icon="fa-clock" library="faregular" iconSize="22" />
				{__('Recently used', 'blockera')}
			</div>

			<div className={controlInnerClassNames('library-body', 'no-fade')}>
				{iconElements}
			</div>
		</div>
	);
}
