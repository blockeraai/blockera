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
import { Tooltip } from '../../../index';

export function SideShape({
	shape,
	className,
	tooltipText,
	...props
}: SideShapeProps): MixedElement {
	return (
		<Tooltip text={tooltipText}>
			<path
				className={controlInnerClassNames(
					'spacing-shape-side',
					className
				)}
				d={shape}
				{...props}
			/>
		</Tooltip>
	);
}
