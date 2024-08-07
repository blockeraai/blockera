export default function MatrixSpaceBetweenEndFillIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="66"
				height="20"
				viewBox="0 0 66 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-space-between-end-fill-row"
			>
				<path d="M32 14C31.4477 14 31 13.5523 31 13L31 1C31 0.447716 31.4477 -7.24234e-08 32 0L34 2.38419e-07C34.5523 3.10842e-07 35 0.447716 35 1L35 13C35 13.5523 34.5523 14 34 14H32Z" />
				<path d="M8 14C7.44771 14 7 13.5523 7 13L7 7C7 6.44772 7.44772 6 8 6H10C10.5523 6 11 6.44772 11 7L11 13C11 13.5523 10.5523 14 10 14H8Z" />
				<path d="M56 14C55.4477 14 55 13.5523 55 13V7C55 6.44772 55.4477 6 56 6H58C58.5523 6 59 6.44772 59 7V13C59 13.5523 58.5523 14 58 14H56Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="66"
			viewBox="0 0 20 66"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-space-between-end-fill-column"
		>
			<path d="M14 34C14 34.5523 13.5523 35 13 35L2 35C1.44772 35 1 34.5523 1 34L1 32C1 31.4477 1.44772 31 2 31L13 31C13.5523 31 14 31.4477 14 32V34Z" />
			<path d="M14 58C14 58.5523 13.5523 59 13 59H7C6.44772 59 6 58.5523 6 58V56C6 55.4477 6.44772 55 7 55H13C13.5523 55 14 55.4477 14 56L14 58Z" />
			<path d="M14 10C14 10.5523 13.5523 11 13 11L7 11C6.44771 11 6 10.5523 6 10V8C6 7.44772 6.44772 7 7 7L13 7C13.5523 7 14 7.44772 14 8V10Z" />
		</svg>
	);
}
