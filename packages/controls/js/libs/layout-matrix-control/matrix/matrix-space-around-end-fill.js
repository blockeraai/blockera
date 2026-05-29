export default function MatrixSpaceAroundEndFillIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="66"
				height="20"
				viewBox="0 0 66 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-space-around-end-fill-row"
			>
				<path d="M32 14C31.4477 14 31 13.5523 31 13V1C31 0.447716 31.4477 -7.24234e-08 32 0L34 2.38419e-07C34.5523 3.10842e-07 35 0.447716 35 1V13C35 13.5523 34.5523 14 34 14H32Z" />
				<path d="M13 14C12.4477 14 12 13.5523 12 13V7C12 6.44772 12.4477 6 13 6H15C15.5523 6 16 6.44772 16 7V13C16 13.5523 15.5523 14 15 14H13Z" />
				<path d="M51 14C50.4477 14 50 13.5523 50 13V7C50 6.44772 50.4477 6 51 6H53C53.5523 6 54 6.44772 54 7V13C54 13.5523 53.5523 14 53 14H51Z" />
			</svg>
		);
	}

	return (
		<svg
			width="22"
			height="66"
			viewBox="0 0 22 66"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-space-around-end-fill-column"
		>
			<path d="M14 34C14 34.5523 13.5523 35 13 35H2C1.44772 35 1 34.5523 1 34V32C1 31.4477 1.44772 31 2 31H13C13.5523 31 14 31.4477 14 32V34Z" />
			<path d="M14 53C14 53.5523 13.5523 54 13 54H7C6.44772 54 6 53.5523 6 53V51C6 50.4477 6.44772 50 7 50H13C13.5523 50 14 50.4477 14 51V53Z" />
			<path d="M14 15C14 15.5523 13.5523 16 13 16H7C6.44771 16 6 15.5523 6 15V13C6 12.4477 6.44772 12 7 12H13C13.5523 12 14 12.4477 14 13V15Z" />
		</svg>
	);
}
