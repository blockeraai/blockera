import { isRTL } from '@wordpress/i18n';

export function CaretIcon() {
	return isRTL ? (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M8.13893 5L11.5572 8.98807L8.13893 12.9762L7 12L9.58163 8.98807L7 5.97619L8.13893 5Z" />
		</svg>
	) : (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M10.4183 5L7 8.98807L10.4183 12.9762L11.5572 12L8.9756 8.98807L11.5572 5.97619L10.4183 5Z" />
		</svg>
	);
}
