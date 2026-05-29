export default function MatrixStretchSpaceAroundIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="66"
				height="66"
				viewBox="0 0 66 66"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-stretch-space-around-row"
			>
				<path d="M32 64C31.4477 64 31 63.5523 31 63V3C31 2.44771 31.4477 2 32 2H34C34.5523 2 35 2.44772 35 3V63C35 63.5523 34.5523 64 34 64H32Z" />
				<path d="M15 64C14.4477 64 14 63.5523 14 63V3C14 2.44771 14.4477 2 15 2H17C17.5523 2 18 2.44772 18 3V63C18 63.5523 17.5523 64 17 64H15Z" />
				<path d="M49 64C48.4477 64 48 63.5523 48 63V3C48 2.44771 48.4477 2 49 2H51C51.5523 2 52 2.44772 52 3V63C52 63.5523 51.5523 64 51 64H49Z" />
			</svg>
		);
	}

	return (
		<svg
			width="66"
			height="66"
			viewBox="0 0 66 66"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-stretch-space-around-column"
		>
			<path d="M2 32C2 31.4477 2.44772 31 3 31H63C63.5523 31 64 31.4477 64 32V34C64 34.5523 63.5523 35 63 35H3C2.44772 35 2 34.5523 2 34V32Z" />
			<path d="M2 17C2 16.4477 2.44772 16 3 16H63C63.5523 16 64 16.4477 64 17V19C64 19.5523 63.5523 20 63 20H3C2.44772 20 2 19.5523 2 19V17Z" />
			<path d="M2 47C2 46.4477 2.44772 46 3 46H63C63.5523 46 64 46.4477 64 47V49C64 49.5523 63.5523 50 63 50H3C2.44772 50 2 49.5523 2 49V47Z" />
		</svg>
	);
}
