export default function ExtraLargeIcon({ onClick, ...props }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20 5.5H4C3.72386 5.5 3.5 5.72386 3.5 6V13C3.5 13.2761 3.72386 13.5 4 13.5H20C20.2761 13.5 20.5 13.2761 20.5 13V6C20.5 5.72386 20.2761 5.5 20 5.5ZM4 4C2.89543 4 2 4.89543 2 6V13C2 14.1046 2.89543 15 4 15H7V17H5C4.44772 17 4 17.4477 4 18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18C20 17.4477 19.5523 17 19 17H17V15H20C21.1046 15 22 14.1046 22 13V6C22 4.89543 21.1046 4 20 4H4ZM15 15H13V17H15V15ZM11 15V17H9V15H11Z"
			/>
		</svg>
	);
}
