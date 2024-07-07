// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { useMedia } from '../';

/**
 * Internal dependencies
 */
import type { MediaQueryProps } from './types';
import { getBaseBreakpoint } from '../../canvas-editor';

export const MediaQuery = ({
	breakpoint,
	children,
}: MediaQueryProps): Element<any> => {
	const { [breakpoint]: media } = useMedia();

	return (
		<>
			{getBaseBreakpoint() === breakpoint && children}
			{media}
			{'{'}
			{children}
			{'}'}
		</>
	);
};
