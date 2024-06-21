export default function RemoveIcon({ className = '' }) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			data-cy="value-addon-btn-remove"
		>
			<path d="M8 8.88833L10.1108 11L11 10.1117L8.88917 8L11 5.88917L10.1117 5.00084L8 7.10999L5.88917 5L5 5.88833L7.11083 8L5 10.1108L5.88833 11L8 8.88833Z" />
		</svg>
	);
}
