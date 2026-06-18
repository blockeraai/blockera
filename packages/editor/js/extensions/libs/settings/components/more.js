// @flow

/**
 * External dependencies
 */
import { forwardRef } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';
import { Icon } from '@blockera/icons';

export const More: React$AbstractComponent<
	{
		label?: string | MixedElement,
		isOpen?: boolean,
		onClick?: () => void,
		className?: string,
	},
	HTMLElement,
> = forwardRef(function More(
	{
		label,
		isOpen,
		onClick,
		className = '',
	}: {
		label?: string | MixedElement,
		isOpen?: boolean,
		onClick?: () => void,
		className?: string,
	},
	ref: { current: ?HTMLElement }
): MixedElement {
	return (
		<Button
			ref={ref}
			label={label}
			data-test={
				'string' === typeof label
					? label.toLowerCase().replace(/\s/g, '-')
					: 'more-settings'
			}
			showTooltip={true}
			className={className || 'blockera-extension-settings-button'}
			isFocus={isOpen || false}
			noBorder={true}
			{...{
				...('function' !== typeof onClick
					? {}
					: {
							onClick: (event: MouseEvent) => {
								event.stopPropagation();

								onClick();
							},
						}),
			}}
		>
			<Icon icon="more-vertical" iconSize="24" />
		</Button>
	);
});
