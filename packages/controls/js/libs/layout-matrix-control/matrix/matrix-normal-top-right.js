export default function MatrixNormalTopRightIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-top-right-row"
			>
				<path d="M9 18C8.44771 18 8 17.5523 8 17L8 3C8 2.44772 8.44772 2 9 2L11 2C11.5523 2 12 2.44772 12 3L12 17C12 17.5523 11.5523 18 11 18H9Z" />
				<path d="M3 10C2.44772 10 2 9.55228 2 9L2 3C2 2.44772 2.44772 2 3 2L5 2C5.55228 2 6 2.44772 6 3L6 9C6 9.55229 5.55228 10 5 10H3Z" />
				<path d="M15 14C14.4477 14 14 13.5523 14 13L14 3C14 2.44772 14.4477 2 15 2L17 2C17.5523 2 18 2.44772 18 3L18 13C18 13.5523 17.5523 14 17 14H15Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-normal-top-right-column"
		>
			<path d="M18 11C18 11.5523 17.5523 12 17 12L3 12C2.44772 12 2 11.5523 2 11L2 9C2 8.44771 2.44772 8 3 8L17 8C17.5523 8 18 8.44772 18 9V11Z" />
			<path d="M18 5C18 5.55228 17.5523 6 17 6L7 6C6.44771 6 6 5.55228 6 5V3C6 2.44771 6.44772 2 7 2L17 2C17.5523 2 18 2.44772 18 3V5Z" />
			<path d="M18 17C18 17.5523 17.5523 18 17 18L11 18C10.4477 18 10 17.5523 10 17V15C10 14.4477 10.4477 14 11 14L17 14C17.5523 14 18 14.4477 18 15V17Z" />
		</svg>
	);
}
