/**
 * External dependencies
 */
import { memo, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

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
		social: {
			lazyLoad: true,
		},
		blockera: {
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
					{icon}{' '}
					{sprintf(
						// translators: %s: Icon Library Name
						__('%s Icons', 'blockera'),
						iconLibraryInfo[library].name
					)}
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
