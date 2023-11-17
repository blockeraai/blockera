export default function TypeMeshGradientIcon() {
	const maskID = 'mask-' + Math.floor(Math.random() * 10000);
	const gr0ID = 'gr-' + Math.floor(Math.random() * 10000);
	const gr1ID = 'gr-' + Math.floor(Math.random() * 10000);
	const gr2ID = 'gr-' + Math.floor(Math.random() * 10000);

	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 1C1.89543 1 1 1.89543 1 3V15C1 16.1046 1.89543 17 3 17H15C16.1046 17 17 16.1046 17 15V3C17 1.89543 16.1046 1 15 1H3ZM3 2C2.44772 2 2 2.44772 2 3V15C2 15.5523 2.44772 16 3 16H15C15.5523 16 16 15.5523 16 15V3C16 2.44772 15.5523 2 15 2H3Z"
				opacity="0.4"
			/>
			<mask
				id={maskID}
				// style="mask-type:alpha"
				maskUnits="userSpaceOnUse"
				x="3"
				y="3"
				width="12"
				height="12"
			>
				<rect x="3" y="3" width="12" height="12" fill="#ffffff" />
			</mask>
			<g mask={`url(#${maskID})`}>
				<rect
					x="7"
					y="7"
					width="12"
					height="12"
					fill={`url(#${gr0ID})`}
				/>
				<rect
					x="4"
					y="-2"
					width="12"
					height="12"
					fill={`url(#${gr1ID})`}
				/>
				<rect
					x="-1"
					y="7"
					width="12"
					height="12"
					fill={`url(#${gr2ID})`}
				/>
			</g>
			<defs>
				<radialGradient
					id={gr0ID}
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(13 13) rotate(90) scale(5)"
				>
					<stop offset="0.25" stopColor="currentColor" />
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</radialGradient>
				<radialGradient
					id={gr1ID}
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(12 4) rotate(90) scale(6)"
				>
					<stop offset="0.25" stopColor="currentColor" />
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</radialGradient>
				<radialGradient
					id={gr2ID}
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(5 14) rotate(90) scale(8)"
				>
					<stop offset="0.161458" stopColor="currentColor" />
					<stop
						offset="0.776042"
						stopOpacity="0"
						stopColor="currentColor"
					/>
				</radialGradient>
			</defs>
		</svg>
	);
}
