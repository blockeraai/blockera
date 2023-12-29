// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import type { SideShapeProps } from '../types';

export function SideShape({
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
