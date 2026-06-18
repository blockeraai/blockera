//@flow

/**
 * External dependencies
 */
import { Button as WPButton } from '@wordpress/components';
import { forwardRef } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { ButtonProps } from './types';

function Button(
	{
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
	}: ButtonProps,
	ref: { current: ?HTMLElement }
): MixedElement {
	return (
		<WPButton
			ref={ref}
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

export default (forwardRef(Button): React$AbstractComponent<
	ButtonProps,
	HTMLElement,
>);
