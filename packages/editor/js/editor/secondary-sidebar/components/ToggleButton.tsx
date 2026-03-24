/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { displayShortcut } from '@wordpress/keycodes';

/**
 * SVG icon for the secondary sidebar toggle button.
 */
const SecondarySidebarIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.5 4H18.5C19.6 4 20.5 4.9 20.5 6V18C20.5 19.1 19.6 20 18.5 20H6.5C5.4 20 4.5 19.1 4.5 18V6C4.5 4.9 5.4 4 6.5 4ZM10.5 18.5H18.5C18.8 18.5 19 18.3 19 18V6C19 5.7 18.8 5.5 18.5 5.5H10.5V18.5ZM6 18C6 18.3 6.2 18.5 6.5 18.5H9V5.5H6.5C6.2 5.5 6 5.7 6 6V18Z"
		/>
	</svg>
);

/**
 * Props for the ToggleButton component.
 */
interface ToggleButtonProps {
	/** Whether the sidebar is currently visible */
	isVisible: boolean;
	/** Callback function when the button is clicked */
	onToggle: () => void;
}

/**
 * Toggle button component for showing/hiding the secondary sidebar.
 */
export default function ToggleButton({
	isVisible,
	onToggle,
}: ToggleButtonProps) {
	const label =
		__('Secondary sidebar', 'blockera') +
		' ' +
		displayShortcut.primaryShift(',');

	return (
		<Button
			icon={<SecondarySidebarIcon />}
			onClick={onToggle}
			isPressed={isVisible}
			label={label}
			aria-label={label}
			className="blockera-secondary-sidebar-toggle"
			size="compact"
		/>
	);
}
