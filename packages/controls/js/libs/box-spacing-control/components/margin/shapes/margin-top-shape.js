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

export function MarginTopSideShape({ ...props }: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M5.51224 0.5H244.487C245.393 0.5 245.832 1.58019 245.202 2.20602L245.555 2.56066L245.202 2.20603L218.921 28.3274C218.166 29.0778 217.14 29.5 216.072 29.5H33.9285C32.8593 29.5 31.8346 29.0778 31.0795 28.3274L4.79753 2.20603C4.79753 2.20603 4.79753 2.20603 4.79753 2.20602C4.16784 1.58017 4.60739 0.5 5.51224 0.5Z"
			{...props}
		/>
	);
}
