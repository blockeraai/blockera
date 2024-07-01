//@flow

/**
 * External dependencies
 */
import { Button as WPButton } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { ButtonProps } from './types';

export default function Button({
	variant = 'tertiary',
	size = 'normal',
	contentAlign = 'center',
	noBorder = false,
	isFocus,
	tooltipPosition = 'top',
	className,
	children,
	//
	...props
}: ButtonProps): MixedElement {
	return (
		<WPButton
			className={componentClassNames(
				'button',
				'size-' + size,
				'variant-' + variant,
				'content-align-' + contentAlign,
				noBorder && 'no-border',
				// eslint-disable-next-line no-nested-ternary
				isFocus !== undefined
					? isFocus
						? 'is-focus toggle-focus'
						: 'toggle-focus'
					: '',
				className
			)}
			variant={variant}
			tooltipPosition={tooltipPosition}
			{...props}
		>
			{children}
		</WPButton>
	);
}
