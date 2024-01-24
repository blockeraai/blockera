// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export const More = ({
	isOpen,
	onClick,
}: {
	isOpen: boolean,
	onClick: () => void,
}): MixedElement => {
	return (
		<div
			className={'publisher-extension-settings toggle'}
			style={{
				boxShadow: isOpen
					? 'inset 0 0 0 1px var(--publisher-controls-primary-color), 0 0 0 1px var(--publisher-controls-primary-color)'
					: '',
			}}
			onClick={(event: MouseEvent) => {
				event.stopPropagation();

				onClick();
			}}
		>
			<svg
				width="3"
				height="14"
				viewBox="0 0 3 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2.5 14H0.5V12H2.5V14ZM2.5 8H0.5V6H2.5V8ZM2.5 2H0.5V0H2.5V2Z"
					fill="black"
				/>
			</svg>
		</div>
	);
};
