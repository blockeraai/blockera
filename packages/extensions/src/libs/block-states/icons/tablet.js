export default function TabletIcon({ onClick }) {
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
				d="M8 6.5H16C16.2761 6.5 16.5 6.72386 16.5 7V17C16.5 17.2761 16.2761 17.5 16 17.5H8C7.72386 17.5 7.5 17.2761 7.5 17V7C7.5 6.72386 7.72386 6.5 8 6.5ZM6 7C6 5.89543 6.89543 5 8 5H16C17.1046 5 18 5.89543 18 7V17C18 18.1046 17.1046 19 16 19H8C6.89543 19 6 18.1046 6 17V7ZM11 14C10.4477 14 10 14.4477 10 15C10 15.5523 10.4477 16 11 16H13C13.5523 16 14 15.5523 14 15C14 14.4477 13.5523 14 13 14H11Z"
			/>
		</svg>
	);
}
