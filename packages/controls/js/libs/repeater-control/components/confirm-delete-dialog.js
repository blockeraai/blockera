// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	__experimentalConfirmDialog as ConfirmDialog,
	CheckboxControl,
} from '@wordpress/components';

interface ConfirmDeleteProps {
	isOpen: boolean;
	item: Object;
	toggleOpen: () => void;
	handleRemoveItem: (item: Object) => void;
	deleteConfirmWarningText?: string;
}

const DEFAULT_DELETE_WARNING = __(
	'This action cannot be undone. Make sure you want to remove this item.',
	'blockera'
);

function ConfirmDeleteDialog({
	item,
	isOpen,
	toggleOpen,
	handleRemoveItem,
	deleteConfirmWarningText,
}: ConfirmDeleteProps): MixedElement {
	const [hasAcknowledged, setHasAcknowledged] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setHasAcknowledged(false);
		}
	}, [isOpen]);

	const handleConfirm = async () => {
		if (!hasAcknowledged) {
			return;
		}

		handleRemoveItem(item);
	};

	const handleCancel = () => {
		setHasAcknowledged(false);
		toggleOpen();
	};

	const warningText = deleteConfirmWarningText ?? DEFAULT_DELETE_WARNING;

	return (
		<ConfirmDialog
			isOpen={isOpen}
			cancelButtonText={__('Cancel', 'blockera')}
			confirmButtonText={__('Delete', 'blockera')}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
			size="medium"
		>
			{item && (
				<>
					<p style={{ margin: '0 0 8px' }}>
						{sprintf(
							/* translators: %s: Name of the item. */
							__(
								'Are you sure you want to delete "%s"?',
								'blockera'
							),
							item?.label || item?.name
						)}
					</p>
					<p style={{ margin: '0 0 12px' }}>{warningText}</p>
					<CheckboxControl
						__nextHasNoMarginBottom={true}
						label={__(
							'I understand and want to delete this item',
							'blockera'
						)}
						checked={hasAcknowledged}
						onChange={setHasAcknowledged}
					/>
				</>
			)}
		</ConfirmDialog>
	);
}

export default ConfirmDeleteDialog;
