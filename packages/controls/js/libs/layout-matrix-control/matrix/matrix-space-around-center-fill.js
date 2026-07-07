export default function MatrixSpaceAroundCenterFillIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="66"
				height="20"
				viewBox="0 0 66 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-space-around-center-fill-row"
			>
				<path d="M32 16C31.4477 16 31 15.5523 31 15V5C31 4.44772 31.4477 4 32 4H34C34.5523 4 35 4.44772 35 5V15C35 15.5523 34.5523 16 34 16H32Z" />
				<path d="M13 14C12.4477 14 12 13.5523 12 13V7C12 6.44772 12.4477 6 13 6H15C15.5523 6 16 6.44772 16 7V13C16 13.5523 15.5523 14 15 14H13Z" />
				<path d="M51 14C50.4477 14 50 13.5523 50 13V7C50 6.44772 50.4477 6 51 6H53C53.5523 6 54 6.44772 54 7V13C54 13.5523 53.5523 14 53 14H51Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="66"
			viewBox="0 0 20 66"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-space-around-center-fill-column"
		>
			<path d="M3 32C3 31.4477 3.44772 31 4 31H16C16.5523 31 17 31.4477 17 32V34C17 34.5523 16.5523 35 16 35H4C3.44772 35 3 34.5523 3 34V32Z" />
			<path d="M6 13C6 12.4477 6.44772 12 7 12H13C13.5523 12 14 12.4477 14 13V15C14 15.5523 13.5523 16 13 16H7C6.44772 16 6 15.5523 6 15V13Z" />
			<path d="M6 50C6 49.4477 6.44771 49 7 49H13C13.5523 49 14 49.4477 14 50V52C14 52.5523 13.5523 53 13 53H7C6.44771 53 6 52.5523 6 52V50Z" />
		</svg>
	);
}
