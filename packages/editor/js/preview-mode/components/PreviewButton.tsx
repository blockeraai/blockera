/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { Icon, Tooltip, Fill } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { displayShortcut } from '@wordpress/keycodes';
import { external } from '@wordpress/icons';
import type { MouseEvent, ReactNode } from 'react';

/**
 * Props for PreviewButton component.
 */
export interface PreviewButtonProps {
	/** Click handler for the button. */
	onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
	/** Whether the preview overlay is currently open. */
	isActive: boolean;
	/** Whether the button should be disabled. */
	disabled: boolean;
	/** Mouse enter handler for prefetching preview. */
	onMouseEnter?: () => void;
	/** Optional href for the anchor tag. */
	href?: string;
}

const PreviewIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		className="blockera-preview-icon"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.9502 1.87109C7.33453 1.88872 7.66485 2.04074 7.91407 2.17578C8.20779 2.33496 8.55597 2.56791 8.94337 2.82617L19.459 9.83691C19.7767 10.0487 20.0727 10.2442 20.2979 10.4258C20.5246 10.6087 20.7924 10.8625 20.9463 11.2334C21.1496 11.7237 21.1495 12.2752 20.9463 12.7656C20.7924 13.1367 20.5247 13.3913 20.2979 13.5742C20.0727 13.7558 19.7767 13.9513 19.459 14.1631L8.94337 21.1738C8.55598 21.4321 8.20778 21.665 7.91407 21.8242C7.62924 21.9786 7.23844 22.1551 6.78223 22.1279C6.19853 22.0931 5.65945 21.8042 5.30665 21.3379C5.03089 20.9733 4.96023 20.5502 4.93067 20.2275C4.9002 19.8949 4.90137 19.4762 4.90137 19.0107V4.98926C4.90137 4.5238 4.90021 4.10509 4.93067 3.77246C4.96024 3.44984 5.0309 3.02666 5.30665 2.66211C5.65945 2.19577 6.19852 1.90693 6.78223 1.87207L6.9502 1.87109ZM6.92286 3.95508C6.90276 4.17475 6.90137 4.48427 6.90137 4.98926V19.0107C6.90137 19.5157 6.90275 19.8253 6.92286 20.0449C6.92404 20.0578 6.92651 20.0699 6.92774 20.0811C6.9379 20.0758 6.95032 20.0717 6.96192 20.0654C7.15582 19.9603 7.41399 19.7898 7.83399 19.5098L18.3496 12.499C18.6994 12.2659 18.9043 12.1277 19.042 12.0166C19.049 12.0109 19.0545 12.0041 19.0606 11.999C19.0547 11.9942 19.0487 11.9878 19.042 11.9824C18.9043 11.8714 18.699 11.7339 18.3496 11.501L7.83399 4.49023C7.41374 4.21007 7.15587 4.03872 6.96192 3.93359C6.95008 3.92718 6.93807 3.92235 6.92774 3.91699C6.92645 3.92866 6.9241 3.94154 6.92286 3.95508Z"
		/>
	</svg>
);

/**
 * PreviewButton component that renders in the editor header.
 * Uses Fill component to render in the header settings slot.
 *
 * @param props - Component props.
 * @return The button component wrapped in Fill.
 */
export default function PreviewButton({
	onClick,
	isActive,
	disabled,
	onMouseEnter,
	href = '#',
}: PreviewButtonProps): ReactNode {
	const [isModifierPressed, setIsModifierPressed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	// Track Command/Ctrl key state to change icon dynamically
	// Shows "external" icon when modifier is held AND mouse is hovering over button, "seen" icon otherwise
	// Uses document-level listeners to detect modifier state globally
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			// Check if Command (Mac) or Ctrl (Windows/Linux) is pressed
			if (event.metaKey || event.ctrlKey) {
				setIsModifierPressed(true);
			}
		};

		const handleKeyUp = (event: KeyboardEvent): void => {
			// Reset when Command/Ctrl key itself is released
			// Also check if modifiers are no longer pressed (handles case where
			// modifier is released after another key in a combination)
			if (event.key === 'Meta' || event.key === 'Control') {
				setIsModifierPressed(false);
			} else if (!event.metaKey && !event.ctrlKey) {
				// If no modifiers are pressed after any keyup, reset state
				setIsModifierPressed(false);
			}
		};

		// Reset state when mouse is clicked without modifier
		// This ensures icon resets if user clicks elsewhere
		const handleMouseDown = (event: globalThis.MouseEvent): void => {
			if (!event.metaKey && !event.ctrlKey) {
				setIsModifierPressed(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		document.addEventListener('mousedown', handleMouseDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
			document.removeEventListener('mousedown', handleMouseDown);
		};
	}, []);

	// Format both shortcuts for tooltip display
	// Toggle: Cmd+P / Ctrl+P, Open in new tab: Cmd+Shift+P / Ctrl+Shift+P
	const toggleShortcut = displayShortcut.primary('p');
	const newTabShortcut = displayShortcut.primaryShift('p');
	const shortcutsDisplay = sprintf(
		/* translators: %1$s and %2$s are keyboard shortcuts (e.g. "Cmd+P"), %3$s is "(new tab)" */
		__('%1$s or %2$s %3$s', 'blockera'),
		toggleShortcut,
		newTabShortcut,
		__('(new tab)', 'blockera')
	);

	return (
		<Fill name="blockera/slots/editor-header-settings">
			<div className="blockera-preview-button-wrapper">
				<Tooltip
					text={__('Live frontend preview', 'blockera')}
					shortcut={shortcutsDisplay}
				>
					<a
						href={href}
						className={`components-button is-compact ${
							isActive ? 'is-pressed' : ''
						}`}
						onClick={(event) => {
							if (disabled) {
								event.preventDefault();
								return;
							}
							// Prevent default navigation - onClick handler manages behavior
							event.preventDefault();
							onClick(event);
						}}
						onMouseEnter={(event) => {
							setIsHovered(true);
							onMouseEnter?.();
						}}
						onMouseLeave={() => {
							setIsHovered(false);
						}}
						aria-label={__('Live frontend preview', 'blockera')}
						aria-expanded={isActive}
						aria-disabled={disabled}
						style={{
							pointerEvents: disabled ? 'none' : 'auto',
							opacity: disabled ? 0.5 : 1,
						}}
					>
						{isModifierPressed && isHovered ? (
							<Icon icon={external} />
						) : (
							PreviewIcon
						)}
					</a>
				</Tooltip>
			</div>
		</Fill>
	);
}
