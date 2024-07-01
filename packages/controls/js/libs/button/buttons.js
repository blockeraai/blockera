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
import { Flex } from '../index';
import type { ButtonsProps } from './types';

export default function Buttons({
	direction = 'row',
	gap = '8px',
	justifyContent,
	alignItems,
	className,
	children,
	...props
}: ButtonsProps): MixedElement {
	return (
		<Flex
			gap={gap}
			direction={direction}
			alignItems={alignItems}
			className={componentClassNames('buttons', className)}
			{...props}
		>
			{children}
		</Flex>
	);
}
