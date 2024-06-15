export default function MatrixNormalCenterRightIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-center-right-row"
			>
				<path d="M9 18C8.44772 18 8 17.5523 8 17L8 3C8 2.44772 8.44772 2 9 2L11 2C11.5523 2 12 2.44772 12 3L12 17C12 17.5523 11.5523 18 11 18H9Z" />
				<path d="M3 14C2.44772 14 2 13.5523 2 13L2 7C2 6.44771 2.44772 6 3 6H5C5.55228 6 6 6.44772 6 7L6 13C6 13.5523 5.55228 14 5 14H3Z" />
				<path d="M15 16C14.4477 16 14 15.5523 14 15L14 5C14 4.44772 14.4477 4 15 4L17 4C17.5523 4 18 4.44772 18 5L18 15C18 15.5523 17.5523 16 17 16H15Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-normal-center-right-column"
		>
			<path d="M18 11C18 11.5523 17.5523 12 17 12L3 12C2.44772 12 2 11.5523 2 11L2 9C2 8.44771 2.44772 8 3 8L17 8C17.5523 8 18 8.44772 18 9V11Z" />
			<path d="M18 17C18 17.5523 17.5523 18 17 18L11 18C10.4477 18 10 17.5523 10 17V15C10 14.4477 10.4477 14 11 14L17 14C17.5523 14 18 14.4477 18 15V17Z" />
			<path d="M18 5C18 5.55228 17.5523 6 17 6L11 6C10.4477 6 10 5.55228 10 5V3C10 2.44772 10.4477 2 11 2L17 2C17.5523 2 18 2.44772 18 3V5Z" />
		</svg>
	);
}
