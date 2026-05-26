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

export function MarginBottomSideShape({
	...props
}: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M31.0692 129.673L31.0692 129.673C31.824 128.922 32.8483 128.5 33.9169 128.5H216.083C217.152 128.5 218.176 128.922 218.931 129.673L245.202 155.794C245.832 156.42 245.392 157.5 244.488 157.5H5.51166C4.6078 157.5 4.16764 156.42 4.79743 155.794C4.79743 155.794 4.79744 155.794 4.79744 155.794L31.0692 129.673Z"
			{...props}
		/>
	);
}
