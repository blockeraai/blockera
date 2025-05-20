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

export function SideShape({
	shape,
	className,
	...props
}: SideShapeProps): MixedElement {
	return (
		<path
			className={controlInnerClassNames('spacing-shape-side', className)}
			d={shape}
			{...props}
		/>
	);
}
