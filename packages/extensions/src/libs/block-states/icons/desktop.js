export default function DesktopIcon({ onClick, ...props }) {
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
				d="M17 6.5H7C6.72386 6.5 6.5 6.72386 6.5 7V13C6.5 13.2761 6.72386 13.5 7 13.5H17C17.2761 13.5 17.5 13.2761 17.5 13V7C17.5 6.72386 17.2761 6.5 17 6.5ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H11V17H10C9.44772 17 9 17.4477 9 18C9 18.5523 9.44772 19 10 19H14C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17H13V15H17C18.1046 15 19 14.1046 19 13V7C19 5.89543 18.1046 5 17 5H7Z"
			/>
		</svg>
	);
}
