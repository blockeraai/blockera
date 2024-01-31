export default function CaretIcon({ isOpen = false }) {
	if (isOpen) {
		return (
			<svg
				width="18"
				height="18"
				viewBox="0 0 18 18"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M14 9.92857L9 6L4 9.92857L4.81818 11L9 7.78571L13.0909 11L14 9.92857Z" />
			</svg>
		);
	}

	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M14 8.07143L9 12L4 8.07143L4.81818 7L9 10.2143L13.0909 7L14 8.07143Z" />
		</svg>
	);
}
