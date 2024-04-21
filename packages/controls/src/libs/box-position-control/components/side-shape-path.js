// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import type { SideShapeProps } from '../types';

export function SideShapePath({
	shape,
	className,
	...props
}: SideShapeProps): MixedElement {
	return (
		<path
			className={controlInnerClassNames('shape-side', className)}
			d={shape}
			{...props}
		/>
	);
}
