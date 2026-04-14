// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../context';
import { useControlContext } from '../../../context';
import { Button } from '../../';
import ConfirmDeleteModal from './confirm-delete-modal';
import { repeaterOnChange } from '../store/reducers/utils';
import { getArialLabelSuffix, isEnabledPromote } from '../utils';

type Props = {
	item: Object,
	itemId: string,
};

/**
 * Delete control for repeater item popover headers (group popover title row).
 */
export default function RepeaterPopoverTitleDelete({
	item,
	itemId,
}: Props): MixedElement | null {
	const {
		count,
		setCount,
		minItems,
		onDelete,
		onChange,
		controlId,
		repeaterId,
		valueCleanup,
		repeaterItems,
		PromoComponent,
		itemIdGenerator,
		actionButtonDelete,
		disableRegenerateId,
		setDisableAddNewItem,
		shouldConfirmDeleteModal,
		deleteConfirmWarningText,
	} = useContext(RepeaterContext);

	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
		useState(false);
	const toggleConfirmDeleteModal = () =>
		setIsConfirmDeleteModalOpen(!isConfirmDeleteModalOpen);

	const itemsCount = Object.keys(repeaterItems).length;

	const {
		dispatch: { modifyControlValue, removeRepeaterItem },
	} = useControlContext();

	function deleteFunction(event: MouseEvent) {
		if (!isConfirmDeleteModalOpen && shouldConfirmDeleteModal) {
			toggleConfirmDeleteModal();
			return;
		} else if (isConfirmDeleteModalOpen) {
			toggleConfirmDeleteModal();
		}

		if (event && event?.hasOwnProperty('stopPropagation')) {
			event.stopPropagation();
		}

		if (
			!disableRegenerateId &&
			isEnabledPromote(PromoComponent, repeaterItems)
		) {
			setCount(count + 1);
			setDisableAddNewItem(true);

			return;
		}

		if (!item.selectable || 'function' !== typeof onDelete) {
			return removeRepeaterItem({
				itemId,
				onChange,
				controlId,
				repeaterId,
				valueCleanup,
				itemIdGenerator,
				disableRegenerateId,
			});
		}

		const value = onDelete(itemId, repeaterItems);

		modifyControlValue({
			controlId,
			value,
		});

		repeaterOnChange(value, {
			onChange,
			valueCleanup,
		});
	}

	const showDelete =
		actionButtonDelete &&
		item?.deletable &&
		(minItems === 0 || itemsCount > minItems);

	if (!showDelete) {
		return null;
	}

	return (
		<>
			{shouldConfirmDeleteModal && isConfirmDeleteModalOpen && (
				<ConfirmDeleteModal
					item={item}
					handleRemoveItem={deleteFunction}
					onClose={() => setIsConfirmDeleteModalOpen(false)}
					deleteConfirmWarningText={deleteConfirmWarningText}
				/>
			)}
			{/*
				Spacer before the delete button is required for reliable clicks.

				The group popover header is a flex row: the title sits next to
				`.blockera-component-popover-title-buttons`. When this trash `Button` is the first
				DOM child in that cluster, the title strip (or other header chrome: sticky layer,
				drag-to-move listeners when enabled, tooltip wrappers) can overlap or win hit-testing
				for the same screen area, so `onClick` never fires. Inserting an extra flex item
				before the button changes layout/stacking so pointer events reach the control.
			*/}
			<div aria-hidden="true" />
			<Button
				size="extra-small"
				align="center"
				onClick={(event: MouseEvent) => {
					event.stopPropagation();
					deleteFunction(event);
				}}
				tabIndex="-1"
				label={sprintf(
					// translators: %s is the repeater item id. It's aria label for deleting repeater item
					__('Delete %s', 'blockera'),
					getArialLabelSuffix(itemId)
				)}
				aria-label={sprintf(
					// translators: %s is the repeater item id. It's aria label for deleting repeater item
					__('Delete %s', 'blockera'),
					getArialLabelSuffix(itemId)
				)}
				tooltipPosition="top"
				showTooltip={true}
			>
				<Icon icon="trash" iconSize="18" />
			</Button>
		</>
	);
}
