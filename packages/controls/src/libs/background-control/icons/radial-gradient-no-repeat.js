export default function RadialGradientNoRepeatIcon({}) {
	const gradientID = 'gr-' + Math.floor(Math.random() * 10000);

	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				opacity="0.5"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9ZM12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9Z"
				fill={'url(#' + gradientID + ')'}
			/>
			<path
				d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z"
				fill="currentColor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 1C1.89543 1 1 1.89543 1 3V15C1 16.1046 1.89543 17 3 17H15C16.1046 17 17 16.1046 17 15V3C17 1.89543 16.1046 1 15 1H3ZM3 2C2.44772 2 2 2.44772 2 3V15C2 15.5523 2.44772 16 3 16H15C15.5523 16 16 15.5523 16 15V3C16 2.44772 15.5523 2 15 2H3Z"
				fill="currentColor"
			/>
			<defs>
				<radialGradient
					id={gradientID}
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(9 9) rotate(90) scale(8)"
				>
					<stop offset="0.3" stopColor="currentColor"></stop>
					<stop
						offset="1"
						stopOpacity="0.1"
						stopColor="currentColor"
					></stop>
				</radialGradient>
			</defs>
		</svg>
	);
}
