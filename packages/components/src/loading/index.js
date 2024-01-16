// @flow

/**
 * External dependencies
 */
import ReactLoading from 'react-loading';
import type { MixedElement } from 'react';

export const LoadingComponent = ({
	type,
	color,
	width = 64,
	height = 64,
}: {
	type: string,
	color: string,
	width?: number,
	height?: number,
}): MixedElement => (
	<ReactLoading type={type} color={color} height={height} width={width} />
);
