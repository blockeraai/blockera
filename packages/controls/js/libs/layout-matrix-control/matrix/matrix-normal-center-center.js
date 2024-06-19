export default function MatrixNormalCenterCenterIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-center-center-row"
			>
				<path d="M9 18C8.44771 18 8 17.5523 8 17L8 3C8 2.44771 8.44772 2 9 2L11 2C11.5523 2 12 2.44772 12 3L12 17C12 17.5523 11.5523 18 11 18L9 18Z" />
				<path d="M3 14C2.44771 14 2 13.5523 2 13L2 7C2 6.44771 2.44772 6 3 6L5 6C5.55228 6 6 6.44772 6 7L6 13C6 13.5523 5.55228 14 5 14L3 14Z" />
				<path d="M15 14C14.4477 14 14 13.5523 14 13L14 7C14 6.44772 14.4477 6 15 6L17 6C17.5523 6 18 6.44772 18 7L18 13C18 13.5523 17.5523 14 17 14L15 14Z" />
			</svg>
		);
	}

	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			data-test="matrix-normal-center-center-column"
		>
			<path d="M18 11C18 11.5523 17.5523 12 17 12L3 12C2.44772 12 2 11.5523 2 11L2 9C2 8.44771 2.44772 8 3 8L17 8C17.5523 8 18 8.44772 18 9V11Z" />
			<path d="M14 17C14 17.5523 13.5523 18 13 18L7 18C6.44772 18 6 17.5523 6 17V15C6 14.4477 6.44772 14 7 14L13 14C13.5523 14 14 14.4477 14 15V17Z" />
			<path d="M14 5C14 5.55228 13.5523 6 13 6L7 6C6.44772 6 6 5.55228 6 5V3C6 2.44772 6.44772 2 7 2L13 2C13.5523 2 14 2.44772 14 3V5Z" />
		</svg>
	);
}
