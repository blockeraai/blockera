// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/components';

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
			<svg
				width="3"
				height="14"
				viewBox="0 0 3 14"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M2.5 14H0.5V12H2.5V14ZM2.5 8H0.5V6H2.5V8ZM2.5 2H0.5V0H2.5V2Z" />
			</svg>
		</Button>
	);
};