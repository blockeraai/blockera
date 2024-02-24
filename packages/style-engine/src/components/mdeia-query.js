// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { useMedia } from '@publisher/style-engine';

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
			{media}
			{'{'}
			{children}
			{'}'}
		</>
	);
};
