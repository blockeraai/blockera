export default function LinearGradientRepeatIcon() {
	const gradient0ID = 'gr-' + Math.floor(Math.random() * 10000);
	const gradient1ID = 'gr-' + Math.floor(Math.random() * 10000);
	const gradient2ID = 'gr-' + Math.floor(Math.random() * 10000);
	const gradient3ID = 'gr-' + Math.floor(Math.random() * 10000);
	const gradient4ID = 'gr-' + Math.floor(Math.random() * 10000);
	const gradient5ID = 'gr-' + Math.floor(Math.random() * 10000);

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
				d="M7.55636 3L3 7.55636V4C3 3.44771 3.44772 3 4 3H7.55636Z"
				fill={'url(#' + gradient0ID + ')'}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.799 3L3 11.799V7.55637L7.55637 3H11.799Z"
				fill={'url(#' + gradient1ID + ')'}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15 4.04165L4.04165 15H4C3.44772 15 3 14.5523 3 14V11.799L11.799 3H14C14.5523 3 15 3.44772 15 4V4.04165Z"
				fill={'url(#' + gradient2ID + ')'}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15 8.2843L8.28427 15H4.04163L15 4.04166V8.2843Z"
				fill={'url(#' + gradient3ID + ')'}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.5564 15H8.31372L15 8.31372V12.5564L12.5564 15Z"
				fill={'url(#' + gradient4ID + ')'}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15 12.3137V14C15 14.5523 14.5523 15 14 15H12.3137L15 12.3137Z"
				fill={'url(#' + gradient5ID + ')'}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 1C1.89543 1 1 1.89543 1 3V15C1 16.1046 1.89543 17 3 17H15C16.1046 17 17 16.1046 17 15V3C17 1.89543 16.1046 1 15 1H3ZM3 2C2.44772 2 2 2.44772 2 3V15C2 15.5523 2.44772 16 3 16H15C15.5523 16 16 15.5523 16 15V3C16 2.44772 15.5523 2 15 2H3Z"
				fill="currentColor"
				opacity="0.4"
			/>
			<defs>
				<linearGradient
					id={gradient0ID}
					x1="2.65685"
					y1="3.65687"
					x2="4.77817"
					y2="5.77819"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="currentColor" />
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</linearGradient>
				<linearGradient
					id={gradient1ID}
					x1="4.77819"
					y1="5.77817"
					x2="6.89951"
					y2="7.89949"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="currentColor"></stop>
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</linearGradient>
				<linearGradient
					id={gradient2ID}
					x1="7.32108"
					y1="7.47794"
					x2="9.4424"
					y2="9.59926"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="currentColor" />
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</linearGradient>
				<linearGradient
					id={gradient3ID}
					x1="9.92492"
					y1="9.11674"
					x2="12.0462"
					y2="11.2381"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="currentColor" />
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</linearGradient>
				<linearGradient
					id={gradient4ID}
					x1="11.6569"
					y1="11.6569"
					x2="13.7782"
					y2="13.7782"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="currentColor" />
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</linearGradient>
				<linearGradient
					id={gradient5ID}
					x1="13.6569"
					y1="13.6569"
					x2="15.7782"
					y2="15.7782"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="currentColor" />
					<stop offset="1" stopOpacity="0" stopColor="currentColor" />
				</linearGradient>
			</defs>
		</svg>
	);
}
