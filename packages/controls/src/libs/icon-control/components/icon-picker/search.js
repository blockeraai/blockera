/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { SearchControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { default as SearchIcon } from '../../icons/search';
import { getLibraryIcons } from '../../utils';
import { IconContext } from '../../context';

export default function Search({}) {
	const [searchInput, setSearchInput] = useState('');
	const [searchData, setSearchData] = useState([]);

	const { handleIconSelect } = useContext(IconContext);

	return (
		<div
			className={controlInnerClassNames(
				'icon-search',
				searchInput ? 'is-searched' : ''
			)}
		>
			<SearchControl
				defaultValue={searchInput}
				onChange={(value) => {
					setSearchInput(value);
					setSearchData(
						getLibraryIcons({
							library: 'search',
							query: value,
							onClick: handleIconSelect,
							limit: 49,
						})
					);
				}}
				placeholder={__('Search icons…', 'blockera')}
			/>

			{searchInput && (
				<div
					className={controlInnerClassNames(
						'icon-library',
						'library-search',
						'is-rendered',
						!searchInput ? 'is-empty' : ''
					)}
				>
					<div className={controlInnerClassNames('library-header')}>
						<SearchIcon /> {__('Search Result', 'blockera')}
					</div>

					{searchInput.length < 3 ? (
						<span
							className={controlInnerClassNames(
								'library-search-hint'
							)}
						>
							{sprintf(
								// translators: %d is minimum repaired characters to make search work
								_n(
									'Please enter at least %d more characters for icon search.',
									'Please enter at least %d more character for icon search.',
									searchInput.length,
									'blockera'
								),
								3 - searchInput.length
							)}
						</span>
					) : (
						<>
							{!searchData.length ? (
								<span
									className={controlInnerClassNames(
										'library-search-hint'
									)}
								>
									{__(
										'Sorry, no icons found. Please try a different keyword.',
										'blockera'
									)}
								</span>
							) : (
								<div
									className={controlInnerClassNames(
										'library-body'
									)}
								>
									{searchData}
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
