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
	grow,
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
				flexGrow: grow,
				...style,
			}}
			{...props}
			className={componentClassNames('flex', className)}
		>
			{children}
		</div>
	);
}
