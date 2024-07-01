//@flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { FlexProps } from './types';

export default function Flex({
	direction = 'row',
	gap = '8px',
	justifyContent,
	alignItems,
	flexWrap,
	children,
	className,
	style,
	...props
}: FlexProps): MixedElement {
	return (
		<div
			style={{
				flexDirection: direction,
				justifyContent,
				gap,
				alignItems,
				flexWrap,
				...style,
			}}
			{...props}
			className={componentClassNames('flex', className)}
		>
			{children}
		</div>
	);
}
