// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { useMedia } from '../hooks';

/**
 * Internal dependencies
 */
import { Style } from './style';
import type { MediaQueryProps } from './types';
import { isBaseBreakpoint } from '../../editor/header-ui';

export const MediaQuery = ({
	breakpoint,
	declarations,
}: MediaQueryProps): Element<any> => {
	const { [breakpoint]: media } = useMedia();

	return (
		<>
			{isBaseBreakpoint(breakpoint) && (
				<Style declarations={declarations} />
			)}
			{media && <Style declarations={`${media}{${declarations}}`} />}
		</>
	);
};
