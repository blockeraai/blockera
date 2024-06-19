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
				<path d="M50 19C49.4477 19 49 18.5523 49 18L49 2C49 1.44772 49.4477 1 50 1L52 1C52.5523 1 53 1.44772 53 2L53 18C53 18.5523 52.5523 19 52 19H50Z" />
				<path d="M38 19C37.4477 19 37 18.5523 37 18L37 10C37 9.44772 37.4477 9 38 9H40C40.5523 9 41 9.44772 41 10L41 18C41 18.5523 40.5523 19 40 19H38Z" />
				<path d="M62 19C61.4477 19 61 18.5523 61 18V10C61 9.44772 61.4477 9 62 9H64C64.5523 9 65 9.44772 65 10V18C65 18.5523 64.5523 19 64 19H62Z" />
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
			<path d="M20 52C20 52.5523 19.5523 53 19 53L3 53C2.44772 53 2 52.5523 2 52L2 50C2 49.4477 2.44771 49 3 49L19 49C19.5523 49 20 49.4477 20 50L20 52Z" />
			<path d="M20 64C20 64.5523 19.5523 65 19 65L11 65C10.4477 65 10 64.5523 10 64L10 62C10 61.4477 10.4477 61 11 61L19 61C19.5523 61 20 61.4477 20 62L20 64Z" />
			<path d="M20 40C20 40.5523 19.5523 41 19 41L11 41C10.4477 41 10 40.5523 10 40L10 38C10 37.4477 10.4477 37 11 37L19 37C19.5523 37 20 37.4477 20 38L20 40Z" />
		</svg>
	);
}
