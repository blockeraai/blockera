// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { SideShape } from '../../side-shape';
import type { SideShapeProps } from '../../../types';

export function MarginAllSideShape({ ...props }: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M0.5 4C0.5 2.06889 2.0723 0.5 4.01606 0.5H245.984C247.928 0.5 249.5 2.06889 249.5 4V154C249.5 155.931 247.928 157.5 245.984 157.5H4.01607C2.07231 157.5 0.5 155.931 0.5 154V4ZM32.1285 29.5C30.7453 29.5 29.6205 30.6174 29.6205 32V126C29.6205 127.383 30.7453 128.5 32.1285 128.5H217.871C219.255 128.5 220.38 127.383 220.38 126V32C220.38 30.6174 219.255 29.5 217.871 29.5H32.1285Z"
			{...props}
		/>
	);
}
