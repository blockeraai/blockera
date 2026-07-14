/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useContext, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlInnerClassNames,
	controlClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button } from '../../../button';
import { IconContext } from '../../context';
import { buildRecentIconElements } from '../../utils';
import { useDraftIconHighlight } from '../../hooks/use-draft-icon-highlight';

export default function RecentIcons() {
	const libraryBodyRef = useRef(null);

	const {
		recentIcons,
		removeRecentIcon,
		clearRecentIcons,
		handleIconSelect,
		handleLibraryIconQuickSelect,
		draftLibraryIcon,
	} = useContext(IconContext);

	const iconElements = useMemo(
		() =>
			buildRecentIconElements({
				items: recentIcons,
				onSelect: handleIconSelect,
				onDoubleSelect: handleLibraryIconQuickSelect,
				onRemove: removeRecentIcon,
			}),
		[
			recentIcons,
			handleIconSelect,
			handleLibraryIconQuickSelect,
			removeRecentIcon,
		]
	);

	useDraftIconHighlight(libraryBodyRef, draftLibraryIcon, recentIcons.length);

	if (!iconElements.length) {
		return null;
	}

	return (
		<div
			className={controlClassNames(
				'icon-library',
				'library-recent',
				'icon-picker-recent-icons',
				'is-rendered'
			)}
		>
			<div
				className={controlClassNames(
					'library-header',
					'recent-icons-header'
				)}
			>
				<div
					className={controlClassNames('recent-icons-header__title')}
				>
					<Icon icon="fa-clock" library="faregular" iconSize="22" />
					{__('Recently used', 'blockera')}
				</div>

				<Button
					variant="tertiary"
					size="extra-small"
					className={controlInnerClassNames('recent-icons-clear')}
					aria-label={__('Clear all recently used icons', 'blockera')}
					onClick={(event) => {
						event.stopPropagation();
						clearRecentIcons();
					}}
				>
					{__('Clear all', 'blockera')}
				</Button>
			</div>

			<div
				className={controlInnerClassNames('library-body', 'no-fade')}
				ref={libraryBodyRef}
			>
				{iconElements}
			</div>
		</div>
	);
}
