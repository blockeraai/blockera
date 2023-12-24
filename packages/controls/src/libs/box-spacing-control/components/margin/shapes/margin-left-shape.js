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

export function MarginLeftSideShape({
	...props
}: SideShapeProps): MixedElement {
	return (
		<SideShape
			{...props}
			shape="M2.20735 153.202L2.20648 153.203C1.57865 153.833 0.5 153.39 0.5 152.492V5.5083C0.5 4.60941 1.57888 4.16702 2.20649 4.79684L28.3278 31.0102C29.0781 31.7632 29.5 32.7848 29.5 33.8505V124.277C29.5 125.342 29.0782 126.364 28.328 127.117C28.328 127.117 28.3279 127.117 28.3278 127.117L2.20735 153.202Z"
		/>
	);
}
