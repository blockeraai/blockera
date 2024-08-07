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
				<path d="M32 64C31.4477 64 31 63.5523 31 63L31 3C31 2.44771 31.4477 2 32 2L34 2C34.5523 2 35 2.44772 35 3L35 63C35 63.5523 34.5523 64 34 64H32Z" />
				<path d="M20 64C19.4477 64 19 63.5523 19 63L19 3C19 2.44771 19.4477 2 20 2L22 2C22.5523 2 23 2.44772 23 3L23 63C23 63.5523 22.5523 64 22 64H20Z" />
				<path d="M44 64C43.4477 64 43 63.5523 43 63L43 3C43 2.44771 43.4477 2 44 2L46 2C46.5523 2 47 2.44772 47 3L47 63C47 63.5523 46.5523 64 46 64H44Z" />
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
			<path d="M2 32C2 31.4477 2.44772 31 3 31L63 31C63.5523 31 64 31.4477 64 32V34C64 34.5523 63.5523 35 63 35L3 35C2.44772 35 2 34.5523 2 34L2 32Z" />
			<path d="M2 20C2 19.4477 2.44772 19 3 19L63 19C63.5523 19 64 19.4477 64 20V22C64 22.5523 63.5523 23 63 23L3 23C2.44772 23 2 22.5523 2 22L2 20Z" />
			<path d="M2 44C2 43.4477 2.44772 43 3 43L63 43C63.5523 43 64 43.4477 64 44V46C64 46.5523 63.5523 47 63 47L3 47C2.44772 47 2 46.5523 2 46L2 44Z" />
		</svg>
	);
}
