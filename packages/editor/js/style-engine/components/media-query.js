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
import { isBaseBreakpoint } from '../../canvas-editor/components/breakpoints/helpers';

export const MediaQuery = ({
	clientId,
	breakpoint,
	declarations,
}: MediaQueryProps): Element<any> => {
	const { [breakpoint]: media } = useMedia();

	return (
		<>
			{isBaseBreakpoint(breakpoint) && (
				<Style clientId={clientId} declarations={declarations} />
			)}
			{media && (
				<Style
					clientId={clientId}
					declarations={`${media}{${declarations}}`}
				/>
			)}
		</>
	);
};
