export default function MatrixNormalEmptyIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="22"
				height="22"
				viewBox="0 0 22 22"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-empty-row"
			>
				<rect x="9" y="7" width="4" height="8" rx="1" />
			</svg>
		);
	}

	return (
		<svg
			width="22"
			height="22"
			viewBox="0 0 22 22"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-normal-empty-column"
		>
			<path d="M14 9C14.5523 9 15 9.44772 15 10V12C15 12.5523 14.5523 13 14 13L8 13C7.44772 13 7 12.5523 7 12L7 10C7 9.44772 7.44772 9 8 9L14 9Z" />
		</svg>
	);
}
