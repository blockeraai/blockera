export default function LargeIcon({ onClick }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6 5.5H18C18.2761 5.5 18.5 5.72386 18.5 6V13C18.5 13.2761 18.2761 13.5 18 13.5H6C5.72386 13.5 5.5 13.2761 5.5 13V6C5.5 5.72386 5.72386 5.5 6 5.5ZM4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V13C20 14.1046 19.1046 15 18 15H15V17H16C16.5523 17 17 17.4477 17 18C17 18.5523 16.5523 19 16 19H8C7.44772 19 7 18.5523 7 18C7 17.4477 7.44772 17 8 17H9V15H6C4.89543 15 4 14.1046 4 13V6ZM13 17V15H11V17H13Z"
			/>
		</svg>
	);
}
