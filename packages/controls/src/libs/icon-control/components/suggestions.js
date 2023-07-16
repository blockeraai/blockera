/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { getLibraryIcons } from '../utils';
import { useContext } from '@wordpress/element';
import { IconContext } from '../context';
import { isEmpty, isUndefined } from '@publisher/utils';

export default function Suggestions({ limit = 6 }) {
	const { handleIconSelect, suggestionsQuery, isCurrentIcon } =
		useContext(IconContext);

	if (isUndefined(suggestionsQuery) || isEmpty(suggestionsQuery)) {
		return <></>;
	}

	const icons = getLibraryIcons({
		library: 'search',
		query: suggestionsQuery,
		onClick: handleIconSelect,
		limit,
		isCurrentIcon,
	});

	return (
		<>
			{icons.length && (
				<div className={controlInnerClassNames('icon-suggestions')}>
					{icons}
				</div>
			)}
		</>
	);
}
