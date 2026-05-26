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
import type { MediaQueryProps } from './types';
import { isBaseBreakpoint } from '../../canvas-editor/components/breakpoints/helpers';

export const MediaQuery = ({
	breakpoint,
	children,
}: MediaQueryProps): Element<any> => {
	const { [breakpoint]: media } = useMedia();

	return (
		<>
			{isBaseBreakpoint(breakpoint) && children}
			{media && (
				<>
					{media}
					{'{'}
					{children}
					{'}'}
				</>
			)}
		</>
	);
};
