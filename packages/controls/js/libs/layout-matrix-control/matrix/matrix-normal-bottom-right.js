export default function MatrixNormalBottomRightIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-bottom-right-row"
			>
				<path d="M9 18C8.44772 18 8 17.5523 8 17L8 3C8 2.44772 8.44772 2 9 2L11 2C11.5523 2 12 2.44772 12 3L12 17C12 17.5523 11.5523 18 11 18H9Z" />
				<path d="M15 18C14.4477 18 14 17.5523 14 17L14 7C14 6.44771 14.4477 6 15 6H17C17.5523 6 18 6.44772 18 7L18 17C18 17.5523 17.5523 18 17 18H15Z" />
				<path d="M3 18C2.44772 18 2 17.5523 2 17L2 11C2 10.4477 2.44772 10 3 10L5 10C5.55228 10 6 10.4477 6 11L6 17C6 17.5523 5.55228 18 5 18H3Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-normal-bottom-right-column"
		>
			<path d="M18 11C18 11.5523 17.5523 12 17 12L3 12C2.44772 12 2 11.5523 2 11L2 9C2 8.44771 2.44772 8 3 8L17 8C17.5523 8 18 8.44772 18 9V11Z" />
			<path d="M18 17C18 17.5523 17.5523 18 17 18L7 18C6.44771 18 6 17.5523 6 17V15C6 14.4477 6.44772 14 7 14L17 14C17.5523 14 18 14.4477 18 15V17Z" />
			<path d="M18 5C18 5.55228 17.5523 6 17 6L11 6C10.4477 6 10 5.55228 10 5V3C10 2.44772 10.4477 2 11 2L17 2C17.5523 2 18 2.44772 18 3V5Z" />
		</svg>
	);
}
