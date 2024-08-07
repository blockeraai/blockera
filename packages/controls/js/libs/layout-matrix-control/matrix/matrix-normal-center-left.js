export default function MatrixNormalCenterLeftIcon({ direction = 'row' }) {
	if (direction === 'row') {
		return (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				data-test="matrix-normal-center-left-row"
			>
				<path d="M9 18C8.44771 18 8 17.5523 8 17L8 3C8 2.44771 8.44772 2 9 2L11 2C11.5523 2 12 2.44772 12 3L12 17C12 17.5523 11.5523 18 11 18L9 18Z" />
				<path d="M3 16C2.44771 16 2 15.5523 2 15L2 5C2 4.44771 2.44772 4 3 4L5 4C5.55228 4 6 4.44771 6 5L6 15C6 15.5523 5.55228 16 5 16L3 16Z" />
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
			data-test="matrix-normal-center-left-column"
		>
			<path d="M18 11C18 11.5523 17.5523 12 17 12L3 12C2.44772 12 2 11.5523 2 11L2 9C2 8.44771 2.44772 8 3 8L17 8C17.5523 8 18 8.44772 18 9V11Z" />
			<path d="M10 17C10 17.5523 9.55228 18 9 18L3 18C2.44772 18 2 17.5523 2 17L2 15C2 14.4477 2.44772 14 3 14L9 14C9.55229 14 10 14.4477 10 15V17Z" />
			<path d="M10 5C10 5.55228 9.55228 6 9 6L3 6C2.44772 6 2 5.55228 2 5L2 3C2 2.44772 2.44772 2 3 2L9 2C9.55229 2 10 2.44772 10 3V5Z" />
		</svg>
	);
}
