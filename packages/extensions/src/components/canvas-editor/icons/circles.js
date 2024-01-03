// @flow

import type { MixedElement } from 'react';

export default function ({
	onClick,
}: {
	onClick: (event: MouseEvent) => void,
}): MixedElement {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
		>
			<path
				d="M5 9C5 9.82843 4.32843 10.5 3.5 10.5C2.67157 10.5 2 9.82843 2 9C2 8.17157 2.67157 7.5 3.5 7.5C4.32843 7.5 5 8.17157 5 9Z"
				fill="#2F2F2F"
			/>
			<path
				d="M10.5 9C10.5 9.82843 9.82843 10.5 9 10.5C8.17157 10.5 7.5 9.82843 7.5 9C7.5 8.17157 8.17157 7.5 9 7.5C9.82843 7.5 10.5 8.17157 10.5 9Z"
				fill="#2F2F2F"
			/>
			<path
				d="M16 9C16 9.82843 15.3284 10.5 14.5 10.5C13.6716 10.5 13 9.82843 13 9C13 8.17157 13.6716 7.5 14.5 7.5C15.3284 7.5 16 8.17157 16 9Z"
				fill="#2F2F2F"
			/>
		</svg>
	);
}
