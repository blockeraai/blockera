/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ReactNode } from 'react';

/**
 * Props for PreviewHeader component.
 */
export interface PreviewHeaderProps {
	/** Content to display in the URL bar section */
	urlBarContent: ReactNode;
	/** Additional action buttons to display before the close button */
	actions?: ReactNode;
	/** Callback function when close button is clicked */
	onClose: () => void;
	/** Optional className for the header container */
	className?: string;
}

/**
 * PreviewHeader component that displays a header bar with URL bar, actions, and close button.
 * Used in both preview overlay and zoom mode.
 *
 * @param props - Component props.
 * @returns The header component.
 */
export default function PreviewHeader({
	urlBarContent,
	actions,
	onClose,
	className = '',
}: PreviewHeaderProps): ReactNode {
	return (
		<div className={`blockera-preview-header ${className}`}>
			<div className="blockera-preview-header__browser-icons">
				{/* Hidden gem: first dot closes preview on click (macOS-style) */}
				<button
					type="button"
					className="blockera-preview-header__close-dot"
					onClick={onClose}
					aria-label={__('Close', 'blockera-tabs')}
				/>
				<span />
				<span />
			</div>

			{/* Center section: URL bar content */}
			<div className="blockera-preview-header__url-bar">
				{urlBarContent}
			</div>

			{/* Right section: Action buttons and Close button */}
			<div className="blockera-preview-header__actions">
				{actions}
			</div>
		</div>
	);
}
