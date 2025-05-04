// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { SideShapeProps } from '../types';
import { Tooltip } from '../../tooltip';

export function SideShapePath({
	shape,
	className,
	tooltipText,
	...props
}: SideShapeProps): MixedElement {
	return (
		<Tooltip text={tooltipText}>
			<path
				className={controlInnerClassNames(
					'position-shape-side',
					className
				)}
				d={shape}
				{...props}
			/>
		</Tooltip>
	);
}
