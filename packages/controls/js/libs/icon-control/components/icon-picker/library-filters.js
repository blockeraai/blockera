/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Blockera dependencies
 */
import { getIconLibrary } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import TabMenu from '../../../tabs/tab-menu';
import { formatIconCount, getLibrariesIconCount } from './icon-libraries';

function FilterTabLabel({ label, count }) {
	return (
		<>
			<span
				className={controlInnerClassNames('icon-picker-filter-label')}
			>
				{label}
			</span>
			<span
				className={controlInnerClassNames('icon-picker-filter-count')}
			>
				{formatIconCount(count)}
			</span>
		</>
	);
}

export default function LibraryFilters({ libraries, selected, onFilterClick }) {
	const instanceId = useInstanceId(LibraryFilters, 'icon-library-filters');

	const tabs = useMemo(() => {
		const allCount = getLibrariesIconCount(libraries);
		const items = [];

		for (const library of Object.keys(libraries)) {
			const iconLibraryInfo = getIconLibrary(library);
			const count = iconLibraryInfo[library]?.count ?? 0;

			items.push({
				name: library,
				icon: (
					<span
						className={controlInnerClassNames(
							'icon-picker-filter-icon'
						)}
					>
						{iconLibraryInfo[library]?.icon}
					</span>
				),
				title: (
					<FilterTabLabel
						label={iconLibraryInfo[library]?.name || library}
						count={count}
					/>
				),
			});
		}

		return [
			{
				name: 'all',
				title: (
					<FilterTabLabel
						label={__('All', 'blockera')}
						count={allCount}
					/>
				),
			},
			...items,
		];
	}, [libraries]);

	return (
		<div className={controlInnerClassNames('icon-picker-filters')}>
			<TabMenu
				tabs={tabs}
				selected={selected}
				instanceId={instanceId}
				orientation="vertical"
				design="clean"
				onTabClick={onFilterClick}
			/>
		</div>
	);
}
