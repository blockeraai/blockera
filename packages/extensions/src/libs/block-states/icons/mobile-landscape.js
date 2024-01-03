export default function MobileLandscapeIcon({ onClick }) {
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
				d="M16.5 11H16C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13H16.5V14C16.5 14.2761 16.2761 14.5 16 14.5L8 14.5C7.72386 14.5 7.5 14.2761 7.5 14L7.5 10C7.5 9.72386 7.72386 9.5 8 9.5L16 9.5C16.2761 9.5 16.5 9.72386 16.5 10V11ZM18 11V10C18 8.89543 17.1046 8 16 8H8C6.89543 8 6 8.89543 6 10V14C6 15.1046 6.89543 16 8 16H16C17.1046 16 18 15.1046 18 14V13V11Z"
			/>
		</svg>
	);
}
