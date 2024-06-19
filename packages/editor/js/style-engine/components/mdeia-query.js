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

export const MediaQuery = ({
	breakpoint,
	children,
}: MediaQueryProps): Element<any> => {
	const { [breakpoint]: media } = useMedia();

	return (
		<>
			{'laptop' === breakpoint && children}
			{media}
			{'{'}
			{children}
			{'}'}
		</>
	);
};
