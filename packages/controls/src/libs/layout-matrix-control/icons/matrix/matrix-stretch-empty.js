export default function MatrixStretchEmptyIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="22"
				height="66"
				viewBox="0 0 22 66"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g opacity="0.2">
					<path d="M10 64C9.44772 64 9 63.5523 9 63L9.00001 3C9.00001 2.44771 9.44772 2 10 2L12 2C12.5523 2 13 2.44772 13 3L13 63C13 63.5523 12.5523 64 12 64H10Z" />
					<path d="M4 64C3.44772 64 3 63.5523 3 63L3.00001 3C3.00001 2.44771 3.44772 2 4.00001 2L6 2C6.55229 2 7 2.44772 7 3L6.99999 63C6.99999 63.5523 6.55228 64 5.99999 64H4Z" />
					<path d="M16 64C15.4477 64 15 63.5523 15 63L15 3C15 2.44771 15.4477 2 16 2L18 2C18.5523 2 19 2.44772 19 3L19 63C19 63.5523 18.5523 64 18 64H16Z" />
				</g>
			</svg>
		);
	}

	return (
		<svg
			width="66"
			height="20"
			viewBox="0 0 66 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g opacity="0.2">
				<path d="M64 11C64 11.5523 63.5523 12 63 12L3 12C2.44771 12 2 11.5523 2 11L2 9C2 8.44772 2.44772 8 3 8L63 8C63.5523 8 64 8.44772 64 9V11Z" />
				<path d="M64 17C64 17.5523 63.5523 18 63 18L3 18C2.44771 18 2 17.5523 2 17L2 15C2 14.4477 2.44772 14 3 14L63 14C63.5523 14 64 14.4477 64 15V17Z" />
				<path d="M64 5C64 5.55228 63.5523 6 63 6L3 5.99999C2.44771 5.99999 2 5.55228 2 4.99999L2 3C2 2.44772 2.44772 2 3 2L63 2.00001C63.5523 2.00001 64 2.44772 64 3.00001V5Z" />
			</g>
		</svg>
	);
}
