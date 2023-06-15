/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { SearchControl } from '@publisher/controls';

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
				value={searchInput}
				onChange={(value) => {
					setSearchInput(value);
					setSearchData(
						getLibraryIcons({
							library: 'search',
							query: value,
							onClick: handleIconSelect,
						})
					);
				}}
				placeholder={__('Search icons…', 'publisher-blocks')}
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
						<SearchIcon /> {__('Search Result', 'publisher-core')}
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
									'publisher-core'
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
										'publisher-core'
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
