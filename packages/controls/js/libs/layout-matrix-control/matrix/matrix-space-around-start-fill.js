export default function MatrixSpaceAroundStartFillIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="66"
				height="20"
				viewBox="0 0 66 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-space-around-start-fill-row"
			>
				<path d="M14 19C13.4477 19 13 18.5523 13 18L13 2C13 1.44772 13.4477 1 14 1L16 1C16.5523 1 17 1.44772 17 2L17 18C17 18.5523 16.5523 19 16 19H14Z" />
				<path d="M2 11C1.44771 11 1 10.5523 1 10L1 2C1 1.44772 1.44772 1 2 1L4 1C4.55229 1 5 1.44772 5 2L5 10C5 10.5523 4.55228 11 4 11H2Z" />
				<path d="M26 11C25.4477 11 25 10.5523 25 10V2C25 1.44772 25.4477 1 26 1L28 1C28.5523 1 29 1.44772 29 2V10C29 10.5523 28.5523 11 28 11H26Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="66"
			viewBox="0 0 20 66"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-space-around-start-fill-column"
		>
			<path d="M19 16C19 16.5523 18.5523 17 18 17L2 17C1.44772 17 1 16.5523 1 16L1 14C1 13.4477 1.44772 13 2 13L18 13C18.5523 13 19 13.4477 19 14V16Z" />
			<path d="M11 28C11 28.5523 10.5523 29 10 29H2C1.44772 29 1 28.5523 1 28L1 26C1 25.4477 1.44772 25 2 25H10C10.5523 25 11 25.4477 11 26V28Z" />
			<path d="M11 4C11 4.55228 10.5523 5 10 5L2 5C1.44772 5 1 4.55228 1 4L1 2C1 1.44772 1.44772 1 2 1L10 1C10.5523 1 11 1.44772 11 2V4Z" />
		</svg>
	);
}
