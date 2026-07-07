/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

export interface ConfirmResetPresetDialogProps {
	text: string;
	confirmButtonText: string;
	isOpen: boolean;
	toggleOpen: () => void;
	onConfirm: () => void;
}

/**
 * Shared confirm dialog for resetting or removing a whole origin group of presets
 * (same behavior as the former font-sizes / colors-specific dialogs).
 */
function ConfirmResetPresetDialog({
	text,
	confirmButtonText,
	isOpen,
	toggleOpen,
	onConfirm,
}: ConfirmResetPresetDialogProps) {
	const handleConfirm = async () => {
		toggleOpen();
		onConfirm();
	};

	const handleCancel = () => {
		toggleOpen();
	};

	return (
		<ConfirmDialog
			isOpen={isOpen}
			cancelButtonText={__('Cancel', 'blockera')}
			confirmButtonText={confirmButtonText}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
			size="medium"
		>
			{text}
		</ConfirmDialog>
	);
}

export default ConfirmResetPresetDialog;
