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
				<path d="M32 19C31.4477 19 31 18.5523 31 18L31 2C31 1.44772 31.4477 1 32 1L34 1C34.5523 1 35 1.44772 35 2L35 18C35 18.5523 34.5523 19 34 19H32Z" />
				<path d="M20 15C19.4477 15 19 14.5523 19 14L19 6C19 5.44772 19.4477 5 20 5L22 5C22.5523 5 23 5.44772 23 6L23 14C23 14.5523 22.5523 15 22 15H20Z" />
				<path d="M44 15C43.4477 15 43 14.5523 43 14V6C43 5.44772 43.4477 5 44 5L46 5C46.5523 5 47 5.44772 47 6V14C47 14.5523 46.5523 15 46 15H44Z" />
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
			<path d="M1 32C1 31.4477 1.44772 31 2 31L18 31C18.5523 31 19 31.4477 19 32V34C19 34.5523 18.5523 35 18 35L2 35C1.44772 35 1 34.5523 1 34L1 32Z" />
			<path d="M5 20C5 19.4477 5.44772 19 6 19L14 19C14.5523 19 15 19.4477 15 20L15 22C15 22.5523 14.5523 23 14 23L6 23C5.44772 23 5 22.5523 5 22V20Z" />
			<path d="M5 44C5 43.4477 5.44771 43 6 43H14C14.5523 43 15 43.4477 15 44L15 46C15 46.5523 14.5523 47 14 47H6C5.44771 47 5 46.5523 5 46V44Z" />
		</svg>
	);
}
