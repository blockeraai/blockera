// @flow

/**
 * External dependencies
 */
import { memo, useContext } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { hasSameProps, isEmpty, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getLibraryIcons } from '../utils';
import { IconContext } from '../context';

const Suggestions = ({ limit = 6 }: { limit: number }): MixedElement => {
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
};

export default (memo(Suggestions, hasSameProps): Object);