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

export function MarginRightSideShape({
	...props
}: SideShapeProps): MixedElement {
	return (
		<SideShape
			shape="M221.672 31.0102L221.672 31.0101L247.793 4.79684C247.793 4.79684 247.793 4.79683 247.793 4.79683C248.421 4.16694 249.5 4.60953 249.5 5.50829V152.492C249.5 153.39 248.421 153.833 247.793 153.203L221.672 126.99C220.922 126.237 220.5 125.215 220.5 124.15V33.8504C220.5 32.7847 220.922 31.7631 221.672 31.0102Z"
			{...props}
		/>
	);
}
