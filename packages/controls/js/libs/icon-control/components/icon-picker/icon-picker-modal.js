/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Modal } from '../../../';
import { default as Search } from './search';
import IconLibraries, { DEFAULT_LIBRARIES } from './icon-libraries';
import LibraryFilters from './library-filters';

export default function IconPickerModal({
	libraries = DEFAULT_LIBRARIES,
	search = true,
	onClose = () => {},
}) {
	const [activeFilter, setActiveFilter] = useState('all');
	const [isSearching, setIsSearching] = useState(false);
	const [searchKey, setSearchKey] = useState(0);

	const handleFilterClick = useCallback(
		(filterName) => {
			setActiveFilter(filterName);

			if (isSearching) {
				setIsSearching(false);
				setSearchKey((key) => key + 1);
			}
		},
		[isSearching]
	);

	const handleSearchChange = useCallback((value) => {
		if (value) {
			setActiveFilter('all');
		}

		setIsSearching(Boolean(value));
	}, []);

	return (
		<Modal
			headerIcon={<Icon icon={'icon'} library={'ui'} iconSize={24} />}
			className={controlInnerClassNames('icon-picker-modal')}
			headerTitle={__('Icon library', 'blockera')}
			isDismissible={true}
			onRequestClose={onClose}
		>
			<div className={controlInnerClassNames('icon-picker-modal-body')}>
				<div
					className={controlInnerClassNames(
						'icon-picker-modal-layout'
					)}
				>
					<LibraryFilters
						libraries={libraries}
						selected={activeFilter}
						onFilterClick={handleFilterClick}
					/>

					<div
						className={controlInnerClassNames(
							'icon-picker-modal-content'
						)}
					>
						{search && (
							<Search
								key={searchKey}
								onSearchChange={handleSearchChange}
							/>
						)}

						{!isSearching && (
							<IconLibraries
								libraries={libraries}
								activeFilter={activeFilter}
							/>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
}
