/**
 * External dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { IconContext } from '../../context';
import { getLibraryIcons } from '../../utils';
import SearchControl from '../../../search-control';

export default function Search({}) {
	const [searchInput, setSearchInput] = useState('');
	const [searchData, setSearchData] = useState([]);
	const [searchData2, setSearchData2] = useState([]);

	const { id, handleIconSelect } = useContext(IconContext);

	return (
		<div
			className={controlInnerClassNames(
				'icon-search',
				searchInput ? 'is-searched' : ''
			)}
		>
			<SearchControl
				{...{ ...(id ? { id: `${id}.icon` } : {}) }}
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
					setSearchData2(
						getLibraryIcons({
							library: 'search-2',
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
							<div
								className={controlInnerClassNames(
									'library-header'
								)}
							>
								<Icon icon="search" iconSize="18" />{' '}
								{__('Search Result', 'blockera')}
								<span
									className={controlInnerClassNames(
										'library-header__label'
									)}
								>
									{__('Free', 'blockera')}
								</span>
							</div>

							{!searchData.length ? (
								<p
									className={controlInnerClassNames(
										'library-search-hint'
									)}
								>
									{__('Sorry, no icons found.', 'blockera')}
								</p>
							) : (
								<div
									className={controlInnerClassNames(
										'library-body',
										'no-fade'
									)}
								>
									{searchData}
								</div>
							)}

							<div
								className={controlInnerClassNames(
									'library-header',
									'mt-20'
								)}
							>
								<Icon icon="search" iconSize="18" />{' '}
								{__('Search Result', 'blockera')}
								<span
									className={controlInnerClassNames(
										'library-header__label'
									)}
								>
									{__('Pro', 'blockera')}
								</span>
							</div>

							{!searchData2.length ? (
								<p
									className={controlInnerClassNames(
										'library-search-hint'
									)}
								>
									{__('Sorry, no icons found.', 'blockera')}
								</p>
							) : (
								<div
									className={controlInnerClassNames(
										'library-body',
										'no-fade'
									)}
								>
									{searchData2}
								</div>
							)}

							{!searchData.length && !searchData2.length && (
								<p
									className={controlInnerClassNames(
										'library-search-hint'
									)}
								>
									{__(
										'Please try a different keyword.',
										'blockera'
									)}
								</p>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}
