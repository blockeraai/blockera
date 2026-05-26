/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
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
		blockera: {
			lazyLoad: true,
		},
	},
}) => {
	const stack = [];

	for (const library in libraries) {
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

		stack.push(
			<IconLibrary
				library={library}
				lazyLoad={libraries[library].lazyLoad}
				title={title}
			/>
		);
	}

	return (
		<div className={controlInnerClassNames('icon-libraries')}>{stack}</div>
	);
};

export default memo(IconLibraries);
