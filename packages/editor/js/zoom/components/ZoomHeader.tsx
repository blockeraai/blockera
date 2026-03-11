/**
 * Zoom header component for the editor canvas iframe.
 * Uses PreviewHeader for consistent structure with preview overlay.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';

/**
 * Internal dependencies
 */
import PreviewHeader from '../../preview-mode/header/PreviewHeader';

export interface ZoomHeaderProps {
	/** Current zoom percentage to display */
	zoomPercent: number;
	/** Callback when user requests reset or close */
	onReset: () => void;
}

/**
 * ZoomHeader renders a header bar inside the zoomed iframe.
 * Start: Reset Zoom button. Center: zoom label and percentage. End: close button (PreviewHeader default).
 *
 * @param props - Component props.
 * @return The zoom header element.
 */
export default function ZoomHeader({
	zoomPercent,
	onReset,
}: ZoomHeaderProps): JSX.Element {
	const start = (
		<Button
			variant="tertiary"
			className="blockera-canvas-header__action-btn blockera-canvas-header__action-btn--reset"
			onClick={onReset}
			aria-label={__('Reset zoom to 100%', 'blockera')}
			showTooltip={true}
			noBorder={true}
		>
			{__('Reset Zoom', 'blockera')}
		</Button>
	);

	const content = (
		<div className="blockera-canvas-header__url-bar-content">
			{__('Zoom View', 'blockera')}
			<span>·</span>
			<strong>{zoomPercent}%</strong>
		</div>
	);

	return (
		<PreviewHeader
			content={content}
			start={start}
			onClose={onReset}
			dataBlockeraZoomHeader={true}
		/>
	);
}
