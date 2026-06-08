/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, memo, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { getIconLibrary } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { default as IconLibrary } from './icon-library';

const DEFAULT_LIBRARIES = {
	wp: {
		lazyLoad: false,
	},
	feather: {
		lazyLoad: true,
	},
	lucide: {
		lazyLoad: true,
	},
	untitledui: {
		lazyLoad: true,
	},
	faregular: {
		lazyLoad: true,
	},
	fasolid: {
		lazyLoad: true,
	},
	fabrands: {
		lazyLoad: true,
	},
	brands: {
		lazyLoad: true,
	},
	blockera: {
		lazyLoad: true,
	},
	essentials: {
		lazyLoad: true,
	},
};

function getLibraryHeaderTitle(libraryInfo) {
	const { icon, name, author, link } = libraryInfo;

	return (
		<>
			{icon} {name}
			{author && link && (
				<span
					className={controlInnerClassNames('library-header__author')}
				>
					{createInterpolateElement(
						__('by <author></author>', 'blockera'),
						{
							author: (
								<a
									href={link}
									target="_blank"
									rel="noopener noreferrer"
								>
									{author}
								</a>
							),
						}
					)}
				</span>
			)}
		</>
	);
}

const IconLibraries = ({
	libraries = DEFAULT_LIBRARIES,
	activeFilter = 'all',
}) => {
	// Memoize the library components to prevent unnecessary re-renders
	const libraryComponents = useMemo(() => {
		const entries = Object.entries(libraries).filter(([library]) => {
			return activeFilter === 'all' || library === activeFilter;
		});

		return entries.map(([library, config]) => {
			const iconLibraryInfo = getIconLibrary(library);
			const title = getLibraryHeaderTitle(iconLibraryInfo[library]);

			return (
				<IconLibrary
					key={library}
					library={library}
					lazyLoad={activeFilter === 'all' ? config.lazyLoad : false}
					title={title}
				/>
			);
		});
	}, [libraries, activeFilter]);

	return (
		<div className={controlInnerClassNames('icon-libraries')}>
			{libraryComponents}
		</div>
	);
};

function getLibrariesIconCount(libraries) {
	let count = 0;

	for (const library of Object.keys(libraries)) {
		const iconLibraryInfo = getIconLibrary(library);
		count += iconLibraryInfo[library]?.count ?? 0;
	}

	return count;
}

function formatIconCount(count) {
	const locale = document.documentElement.lang || undefined;

	return Number(count).toLocaleString(locale);
}

export default memo(IconLibraries);
export { DEFAULT_LIBRARIES, formatIconCount, getLibrariesIconCount };
