/**
 * External dependencies
 */
import { memo, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { getIconLibrary } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { default as IconLibrary } from './icon-library';

const IconLibraries = ({
	libraries = {
		wp: {
			lazyLoad: false,
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
	},
}) => {
	// Memoize the library components to prevent unnecessary re-renders
	const libraryComponents = useMemo(() => {
		return Object.entries(libraries).map(([library, config]) => {
			const iconLibraryInfo = getIconLibrary(library);
			const icon = iconLibraryInfo[library].icon;
			const title = (
				<>
					{icon} {iconLibraryInfo[library].name}
					<span
						className={controlInnerClassNames(
							'library-header__count'
						)}
					>
						{iconLibraryInfo[library]?.count}
					</span>
				</>
			);

			return (
				<IconLibrary
					key={library}
					library={library}
					lazyLoad={config.lazyLoad}
					title={title}
				/>
			);
		});
	}, [libraries]);

	return (
		<div className={controlInnerClassNames('icon-libraries')}>
			{libraryComponents}
		</div>
	);
};

export default memo(IconLibraries);
