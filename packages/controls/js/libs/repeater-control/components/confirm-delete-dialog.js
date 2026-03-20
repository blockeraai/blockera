// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

interface ConfirmDeleteProps {
	isOpen: boolean;
	item: Object;
	toggleOpen: () => void;
	handleRemoveItem: (item: Object) => void;
}

function ConfirmDeleteDialog({
	item,
	isOpen,
	toggleOpen,
	handleRemoveItem,
}: ConfirmDeleteProps): MixedElement {
	const handleConfirm = async () => {
		handleRemoveItem(item);
	};

	const handleCancel = () => {
		toggleOpen();
	};

	return (
		<ConfirmDialog
			isOpen={isOpen}
			cancelButtonText={__('Cancel', 'blockera')}
			confirmButtonText={__('Delete', 'blockera')}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		>
			{item &&
				sprintf(
					/* translators: %s: Name of the item. */
					__('Are you sure you want to delete "%s"?', 'blockera'),
					item?.label || item?.name
				)}
		</ConfirmDialog>
	);
}

export default ConfirmDeleteDialog;
