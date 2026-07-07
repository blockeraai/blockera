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
				<path d="M32 19C31.4477 19 31 18.5523 31 18V7C31 6.44772 31.4477 6 32 6H34C34.5523 6 35 6.44772 35 7V18C35 18.5523 34.5523 19 34 19H32Z" />
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
			data-test="matrix-space-around-start-fill-column"
		>
			<path d="M19 34C19 34.5523 18.5523 35 18 35H7C6.44772 35 6 34.5523 6 34V32C6 31.4477 6.44772 31 7 31H18C18.5523 31 19 31.4477 19 32V34Z" />
			<path d="M14 53C14 53.5523 13.5523 54 13 54H7C6.44772 54 6 53.5523 6 53V51C6 50.4477 6.44772 50 7 50H13C13.5523 50 14 50.4477 14 51V53Z" />
			<path d="M14 15C14 15.5523 13.5523 16 13 16H7C6.44772 16 6 15.5523 6 15V13C6 12.4477 6.44772 12 7 12H13C13.5523 12 14 12.4477 14 13V15Z" />
		</svg>
	);
}
