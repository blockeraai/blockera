export default function MatrixNormalTopCenterIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-top-center-row"
			>
				<path d="M9 18C8.44771 18 8 17.5523 8 17L8 3C8 2.44772 8.44772 2 9 2L11 2C11.5523 2 12 2.44772 12 3L12 17C12 17.5523 11.5523 18 11 18H9Z" />
				<path d="M3 10C2.44772 10 2 9.55228 2 9L2 3C2 2.44772 2.44772 2 3 2L5 2C5.55228 2 6 2.44772 6 3L6 9C6 9.55229 5.55228 10 5 10H3Z" />
				<path d="M15 10C14.4477 10 14 9.55229 14 9L14 3C14 2.44772 14.4477 2 15 2L17 2C17.5523 2 18 2.44772 18 3L18 9C18 9.55229 17.5523 10 17 10H15Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-normal-top-center-column"
		>
			<path d="M18 11C18 11.5523 17.5523 12 17 12L3 12C2.44772 12 2 11.5523 2 11L2 9C2 8.44771 2.44772 8 3 8L17 8C17.5523 8 18 8.44772 18 9V11Z" />
			<path d="M14 17C14 17.5523 13.5523 18 13 18L7 18C6.44772 18 6 17.5523 6 17V15C6 14.4477 6.44772 14 7 14L13 14C13.5523 14 14 14.4477 14 15V17Z" />
			<path d="M16 5C16 5.55228 15.5523 6 15 6L5 6C4.44772 6 4 5.55228 4 5L4 3C4 2.44771 4.44772 2 5 2L15 2C15.5523 2 16 2.44772 16 3V5Z" />
		</svg>
	);
}
