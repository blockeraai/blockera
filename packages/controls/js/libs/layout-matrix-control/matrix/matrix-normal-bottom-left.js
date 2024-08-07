export default function MatrixNormalBottomLeftIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-bottom-left-row"
			>
				<path d="M9 18C8.44772 18 8 17.5523 8 17L8 3C8 2.44772 8.44772 2 9 2L11 2C11.5523 2 12 2.44772 12 3L12 17C12 17.5523 11.5523 18 11 18H9Z" />
				<path d="M3 18C2.44772 18 2 17.5523 2 17L2 7C2 6.44771 2.44772 6 3 6H5C5.55229 6 6 6.44772 6 7L6 17C6 17.5523 5.55228 18 5 18H3Z" />
				<path d="M15 18C14.4477 18 14 17.5523 14 17L14 11C14 10.4477 14.4477 10 15 10H17C17.5523 10 18 10.4477 18 11L18 17C18 17.5523 17.5523 18 17 18H15Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-normal-bottom-left-column"
		>
			<path d="M18 11C18 11.5523 17.5523 12 17 12L3 12C2.44772 12 2 11.5523 2 11L2 9C2 8.44771 2.44772 8 3 8L17 8C17.5523 8 18 8.44772 18 9V11Z" />
			<path d="M14 17C14 17.5523 13.5523 18 13 18L3 18C2.44771 18 2 17.5523 2 17L2 15C2 14.4477 2.44772 14 3 14L13 14C13.5523 14 14 14.4477 14 15V17Z" />
			<path d="M10 5C10 5.55228 9.55228 6 9 6L3 6C2.44772 6 2 5.55228 2 5L2 3C2 2.44772 2.44772 2 3 2L9 2C9.55229 2 10 2.44772 10 3V5Z" />
		</svg>
	);
}
