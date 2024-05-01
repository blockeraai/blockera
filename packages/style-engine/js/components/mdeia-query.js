// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { useMedia } from '@blockera/style-engine';

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
