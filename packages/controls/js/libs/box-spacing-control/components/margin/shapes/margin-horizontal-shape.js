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

export function MarginHorizontalSideShape({
	...props
}: SideShapeProps): MixedElement {
	return (
		<SideShape
			{...props}
			shape="M2.20735 153.202L2.20648 153.203C1.57865 153.833 0.5 153.39 0.5 152.492V5.5083C0.5 4.60941 1.57888 4.16702 2.20649 4.79684L28.3278 31.0102C29.0781 31.7632 29.5 32.7848 29.5 33.8505V124.277C29.5 125.342 29.0782 126.364 28.328 127.117C28.328 127.117 28.3279 127.117 28.3278 127.117L2.20735 153.202ZM220.5 124.15V33.8504C220.5 32.7847 220.922 31.7631 221.672 31.0102L247.793 4.79684C248.421 4.16693 249.5 4.60952 249.5 5.50829V152.492C249.5 153.39 248.421 153.833 247.793 153.203L221.672 126.99C220.922 126.237 220.5 125.215 220.5 124.15Z"
		/>
	);
}
