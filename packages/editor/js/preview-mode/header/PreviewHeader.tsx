/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ReactNode } from 'react';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Props for PreviewHeader component.
 */
export interface PreviewHeaderProps {
	/** Content to display in the center section (e.g. URL bar) */
	content: ReactNode;
	/** Content for the start section (e.g. action buttons) */
	start?: ReactNode;
	/** Content for the end section (e.g. close button). If not provided, default close button is shown. */
	end?: ReactNode;
	/** Callback when the default close button is clicked. Ignored if `end` is provided. */
	onClose: () => void;
	/** Optional className for the header container */
	className?: string;
	/** When true, adds data-blockera-zoom-header for zoom mode styling (fixed position) */
	dataBlockeraZoomHeader?: boolean;
	/** Optional stable selector for the default close control (E2E). */
	closeButtonTestId?: string;
}

/**
 * PreviewHeader component that displays a header bar with start, center (content), and end sections.
 * Used in both preview overlay and zoom mode.
 *
 * @param props - Component props.
 * @return The header component.
 */
export default function PreviewHeader({
	content,
	start,
	end,
	onClose,
	className = '',
	dataBlockeraZoomHeader = false,
	closeButtonTestId,
}: PreviewHeaderProps): ReactNode {
	const endContent =
		end !== undefined ? (
			end
		) : (
			<Button
				className="blockera-canvas-header__close-button"
				icon={<Icon icon="close" iconLibrary="wp" iconSize={18} />}
				onClick={onClose}
				aria-label={__('Close', 'blockera')}
				showTooltip={true}
				noBorder={true}
				{...(closeButtonTestId
					? ({
							'test-id': closeButtonTestId,
						} as Record<string, string>)
					: {})}
			/>
		);

	return (
		<div
			className={`blockera-canvas-header ${className}`}
			data-blockera-zoom-header={
				dataBlockeraZoomHeader ? 'true' : undefined
			}
		>
			{/* Start section */}
			<div className="blockera-canvas-header__start">{start}</div>

			{/* Center section */}
			<div className="blockera-canvas-header__center">
				<div className="blockera-canvas-header__url-bar">{content}</div>
			</div>

			{/* End section */}
			<div className="blockera-canvas-header__end">{endContent}</div>
		</div>
	);
}
