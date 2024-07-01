export default function MatrixSpaceBetweenCenterFillIcon({
	direction = 'row',
}) {
	if (direction === 'row') {
		return (
			<svg
				width="66"
				height="20"
				viewBox="0 0 66 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-space-between-center-fill-row"
			>
				<path d="M32 16C31.4477 16 31 15.5523 31 15L31 5C31 4.44772 31.4477 4 32 4L34 4C34.5523 4 35 4.44772 35 5L35 15C35 15.5523 34.5523 16 34 16H32Z" />
				<path d="M8 14C7.44771 14 7 13.5523 7 13L7 7C7 6.44772 7.44772 6 8 6L10 6C10.5523 6 11 6.44772 11 7L11 13C11 13.5523 10.5523 14 10 14H8Z" />
				<path d="M56 14C55.4477 14 55 13.5523 55 13V7C55 6.44772 55.4477 6 56 6L58 6C58.5523 6 59 6.44772 59 7V13C59 13.5523 58.5523 14 58 14H56Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="66"
			viewBox="0 0 20 66"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-space-between-center-fill-column"
		>
			<path d="M3 32C3 31.4477 3.44772 31 4 31L16 31C16.5523 31 17 31.4477 17 32V34C17 34.5523 16.5523 35 16 35L4 35C3.44772 35 3 34.5523 3 34L3 32Z" />
			<path d="M6 8C6 7.44771 6.44772 7 7 7L13 7C13.5523 7 14 7.44772 14 8V10C14 10.5523 13.5523 11 13 11L7 11C6.44772 11 6 10.5523 6 10V8Z" />
			<path d="M6 56C6 55.4477 6.44771 55 7 55H13C13.5523 55 14 55.4477 14 56L14 58C14 58.5523 13.5523 59 13 59H7C6.44771 59 6 58.5523 6 58V56Z" />
		</svg>
	);
}
