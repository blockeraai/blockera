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

export function MarginVerticalSideShape({
	...props
}: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M5.51224 0.5H244.487C245.393 0.5 245.832 1.58019 245.202 2.20602L245.555 2.56066L245.202 2.20603L218.921 28.3273C218.166 29.0778 217.14 29.5 216.072 29.5H33.9285C32.8593 29.5 31.8346 29.0778 31.0795 28.3274L4.79753 2.20603C4.79753 2.20603 4.79753 2.20603 4.79753 2.20602C4.16784 1.58017 4.60739 0.5 5.51224 0.5ZM218.931 129.673L245.202 155.794C245.832 156.42 245.392 157.5 244.488 157.5H5.51166C4.6078 157.5 4.16763 156.42 4.79743 155.794L31.0692 129.673C31.824 128.922 32.8483 128.5 33.9169 128.5H216.083C217.152 128.5 218.176 128.922 218.931 129.673Z"
			{...props}
		/>
	);
}
