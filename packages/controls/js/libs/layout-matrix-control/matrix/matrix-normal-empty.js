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
				<path d="M9 5C9 4.44772 9.44772 4 10 4H12C12.5523 4 13 4.44772 13 5V17C13 17.5523 12.5523 18 12 18H10C9.44772 18 9 17.5523 9 17V5Z" />
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
			<path d="M4 10C4 9.44772 4.44772 9 5 9H17C17.5523 9 18 9.44772 18 10V12C18 12.5523 17.5523 13 17 13H5C4.44772 13 4 12.5523 4 12V10Z" />
		</svg>
	);
}
