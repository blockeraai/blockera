// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';
import { Icon } from '@blockera/icons';

export const More = ({
	label,
	isOpen,
	onClick,
	className = '',
}: {
	label?: string | MixedElement,
	isOpen?: boolean,
	onClick?: () => void,
	className?: string,
}): MixedElement => {
	return (
		<Button
			label={label}
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
};
