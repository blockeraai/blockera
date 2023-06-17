/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { getIconLibrary } from '@publisher/components';

/**
 * Internal dependencies
 */
import { default as IconLibrary } from './icon-library';
import { default as SuggestionsIcon } from '../../icons/suggestions';

const IconLibraries = ({
	libraries = {
		suggestions: {
			lazyLoad: false,
		},
		wp: {
			lazyLoad: false,
		},
		publisher: {
			lazyLoad: true,
		},
		far: {
			lazyLoad: true,
		},
		fas: {
			lazyLoad: true,
		},
	},
}) => {
	const stack = [];

	for (const library in libraries) {
		let title, icon;

		if (library === 'suggestions') {
			title = __('AI Suggestions', 'publisher-cre');
			icon = <SuggestionsIcon />;
		} else {
			const iconLibraryInfo = getIconLibrary(library);

			title = sprintf(
				// translators: %s: Icon Library Name
				__('%s Icons', 'publisher-core'),
				iconLibraryInfo[library].name
			);

			icon = iconLibraryInfo[library].icon;
		}

		title = (
			<>
				{icon} {title}
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
