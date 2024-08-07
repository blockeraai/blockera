export default function MatrixSpaceBetweenStartFillIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="66"
				height="20"
				viewBox="0 0 66 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-space-between-start-fill-row"
			>
				<path d="M32 19C31.4477 19 31 18.5523 31 18L31 7C31 6.44772 31.4477 6 32 6L34 6C34.5523 6 35 6.44772 35 7L35 18C35 18.5523 34.5523 19 34 19H32Z" />
				<path d="M8 14C7.44772 14 7 13.5523 7 13L7 7C7 6.44772 7.44772 6 8 6L10 6C10.5523 6 11 6.44772 11 7L11 13C11 13.5523 10.5523 14 10 14H8Z" />
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
			data-test="matrix-space-between-start-fill-column"
		>
			<path d="M19 34C19 34.5523 18.5523 35 18 35L7 35C6.44772 35 6 34.5523 6 34L6 32C6 31.4477 6.44772 31 7 31L18 31C18.5523 31 19 31.4477 19 32L19 34Z" />
			<path d="M14 58C14 58.5523 13.5523 59 13 59H7C6.44772 59 6 58.5523 6 58L6 56C6 55.4477 6.44772 55 7 55H13C13.5523 55 14 55.4477 14 56V58Z" />
			<path d="M14 10C14 10.5523 13.5523 11 13 11L7 11C6.44772 11 6 10.5523 6 10L6 8C6 7.44772 6.44772 7 7 7L13 7C13.5523 7 14 7.44772 14 8V10Z" />
		</svg>
	);
}
