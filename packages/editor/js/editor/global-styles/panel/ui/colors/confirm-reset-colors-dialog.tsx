/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

interface ConfirmResetColorsDialogProps {
	text: string;
	confirmButtonText: string;
	isOpen: boolean;
	toggleOpen: () => void;
	onConfirm: () => void;
}

function ConfirmResetColorsDialog({
	text,
	confirmButtonText,
	isOpen,
	toggleOpen,
	onConfirm,
}: ConfirmResetColorsDialogProps) {
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

export default ConfirmResetColorsDialog;
