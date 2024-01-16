export default function InformationIcon({ ...props }) {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
			data-test="notice-control-icon-info"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9ZM10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6ZM8 8.25C7.58579 8.25 7.25 8.58579 7.25 9C7.25 9.41421 7.58579 9.75 8 9.75H8.5V12.25C8.5 12.6642 8.83579 13 9.25 13C9.66421 13 10 12.6642 10 12.25V9.5C10 8.80964 9.44036 8.25 8.75 8.25H8Z"
			/>
		</svg>
	);
}
