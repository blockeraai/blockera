// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames, classNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../context';
import { useControlContext } from '../../../context';
import { Button, Tooltip, Flex, MenuItem } from '../../';
import type { RepeaterItemActionsProps } from '../types';
import { repeaterOnChange } from '../store/reducers/utils';
import ConfirmDeleteModal from './confirm-delete-modal';
import {
	getArialLabelSuffix,
	isRepeaterPromoActive,
	closeInspectorRepeaterPopovers,
} from '../utils';

export default function RepeaterItemActions({
	item,
	itemId,
	isVisible,
	setVisibility,
	interactionGuard,
	onOpenItemSettings,
	showItemEditButton = false,
}: RepeaterItemActionsProps): MixedElement | null {
	const {
		count,
		setCount,
		maxItems,
		minItems,
		onDelete,
		onReset,
		onChange,
		controlId,
		repeaterId,
		valueCleanup,
		overrideItem,
		repeaterItems,
		PromoComponent,
		itemIdGenerator,
		disableProHints,
		actionButtonClone,
		actionButtonReset,
		actionButtonsType,
		actionButtonDelete,
		disableRegenerateId,
		setDisableAddNewItem,
		actionButtonVisibility,
		shouldConfirmDeleteModal,
		confirmDeleteModalProps,
	} = useContext(RepeaterContext);

	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
		useState(false);
	const toggleConfirmDeleteModal = () =>
		setIsConfirmDeleteModalOpen(!isConfirmDeleteModalOpen);

	const itemsCount = Object.keys(repeaterItems).length;

	const {
		dispatch: {
			changeRepeaterItem,
			cloneRepeaterItem,
			removeRepeaterItem,
			resetRepeaterItem,
			modifyControlValue,
		},
	} = useControlContext();

	function closeMenu(event: MouseEvent) {
		const escEvent = new KeyboardEvent('keydown', {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			which: 27,
			bubbles: true,
		});

		// $FlowFixMe
		event.currentTarget?.dispatchEvent(escEvent);
	}

	function resetFunction(event: MouseEvent) {
		event.stopPropagation();
		closeMenu(event);

		if (!item.selectable || 'function' !== typeof onReset) {
			return resetRepeaterItem({
				itemId,
				onChange,
				controlId,
				repeaterId,
				valueCleanup,
				itemIdGenerator,
				disableRegenerateId,
			});
		}

		const value = onReset(itemId, repeaterItems);

		modifyControlValue({
			controlId,
			value,
		});

		repeaterOnChange(value, {
			onChange,
			valueCleanup,
		});
	}

	function deleteFunction(event: MouseEvent) {
		if (event && event?.hasOwnProperty('stopPropagation')) {
			event.stopPropagation();
		}

		// Try to open the confirm delete modal if it is not open and shouldConfirmDeleteModal is true
		if (!isConfirmDeleteModalOpen && shouldConfirmDeleteModal) {
			toggleConfirmDeleteModal();
			return;
		} else if (isConfirmDeleteModalOpen) {
			toggleConfirmDeleteModal();
		}

		closeMenu(event);

		closeInspectorRepeaterPopovers();

		if (
			!disableRegenerateId &&
			isRepeaterPromoActive(
				PromoComponent,
				repeaterItems,
				disableProHints
			)
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

	function visibilityFunction(event: MouseEvent) {
		event.stopPropagation();

		if (!item?.isVisible) {
			const visibleItems = [];

			for (const repeaterItemId in repeaterItems) {
				const repeaterItem = repeaterItems[repeaterItemId];
				if (repeaterItem?.isVisible) {
					visibleItems.push(repeaterItemId);
				}
			}

			if (
				visibleItems.length >= 1 &&
				isRepeaterPromoActive(
					PromoComponent,
					repeaterItems,
					disableProHints
				)
			) {
				return setCount(count + 1);
			}
		}

		setVisibility(!isVisible);
		const value = item?.selectable
			? {
					...item,
					isVisible: !isVisible,
					isSelected: false,
				}
			: {
					...item,
					isVisible: !isVisible,
				};

		changeRepeaterItem({
			value,
			itemId,
			onChange,
			controlId,
			repeaterId,
			valueCleanup,
			disableRegenerateId,
		});
	}

	function cloneFunction(event: MouseEvent) {
		event.stopPropagation();
		closeMenu(event);

		if (
			isRepeaterPromoActive(
				PromoComponent,
				repeaterItems,
				disableProHints
			)
		) {
			setCount(count + 1);
			setDisableAddNewItem(true);

			return;
		}

		cloneRepeaterItem({
			itemId,
			onChange,
			controlId,
			repeaterId,
			value: item,
			overrideItem,
			valueCleanup,
			itemIdGenerator,
		});
	}

	const showVisibility = actionButtonVisibility && item?.visibilitySupport;

	const showClone =
		actionButtonClone &&
		item?.cloneable &&
		(maxItems === -1 || itemsCount < maxItems);

	const showDelete =
		actionButtonDelete &&
		item?.deletable &&
		(minItems === 0 || itemsCount > minItems);

	const showReset = actionButtonReset;

	const showEditItemButton =
		showItemEditButton && 'function' === typeof onOpenItemSettings;

	// If no buttons are shown, return null to avoid rendering empty container
	if (
		!showVisibility &&
		!showClone &&
		!showDelete &&
		!showReset &&
		!showEditItemButton
	) {
		return null;
	}

	return (
		<>
			{interactionGuard}

			{shouldConfirmDeleteModal && isConfirmDeleteModalOpen && (
				<ConfirmDeleteModal
					item={item}
					handleRemoveItem={deleteFunction}
					onClose={() => setIsConfirmDeleteModalOpen(false)}
					confirmDeleteModalProps={confirmDeleteModalProps}
				/>
			)}
			{showVisibility && (
				<>
					{actionButtonsType === 'menu' ? (
						<MenuItem
							onClick={visibilityFunction}
							className={controlInnerClassNames('btn-visibility')}
							style={
								!item?.isVisible
									? {
											color: '#e20b0b',
											'--blockera-controls-primary-color':
												'#e20b0b',
											'--wp-components-color-accent':
												'#e20b0b',
										}
									: {
											'--blockera-controls-primary-color':
												'#e20b0b',
											'--wp-components-color-accent':
												'#e20b0b',
										}
							}
						>
							<Flex alignItems="center" gap="10px">
								<Icon
									icon={isVisible ? 'eye-show' : 'eye-hide'}
									iconSize={20}
								/>

								{isVisible
									? __('Disable', 'blockera')
									: __('Enable', 'blockera')}
							</Flex>
						</MenuItem>
					) : (
						<Tooltip
							text={
								isVisible
									? __('Disable', 'blockera')
									: __('Enable', 'blockera')
							}
							style={{
								'--tooltip-bg': '#e20b0b',
							}}
							delay={300}
						>
							<Button
								className={controlInnerClassNames(
									'btn-visibility'
								)}
								noBorder={true}
								icon={
									<Icon
										icon={
											isVisible ? 'eye-show' : 'eye-hide'
										}
										iconSize={22}
									/>
								}
								onClick={visibilityFunction}
								aria-label={
									isVisible
										? sprintf(
												// translators: %s is the repeater item id. It's aria label for disabling repeater item
												__('Disable %s', 'blockera'),
												getArialLabelSuffix(itemId)
											)
										: sprintf(
												// translators: %s is the repeater item id. It's aria label for enabling repeater item
												__('Enable %s', 'blockera'),
												getArialLabelSuffix(itemId)
											)
								}
							/>
						</Tooltip>
					)}
				</>
			)}

			{showEditItemButton && (
				<Tooltip
					text={__('Edit', 'blockera')}
					style={{
						'--tooltip-bg':
							'var(--blockera-controls-primary-color)',
					}}
					delay={300}
				>
					<Button
						className={controlInnerClassNames('btn-edit-item')}
						noBorder={true}
						icon={<Icon icon="pen" iconSize={20} />}
						onClick={(event: MouseEvent) => {
							event.stopPropagation();
							// $FlowFixMe
							onOpenItemSettings();
						}}
						aria-label={sprintf(
							// translators: %s is the repeater item id.
							__('Edit %s', 'blockera'),
							getArialLabelSuffix(itemId)
						)}
					/>
				</Tooltip>
			)}

			{showClone && (
				<>
					{actionButtonsType === 'menu' ? (
						<MenuItem
							onClick={cloneFunction}
							className={controlInnerClassNames('btn-clone')}
						>
							<Flex alignItems="center" gap="10px">
								<Icon icon="clone" iconSize={20} />
								{__('Clone (duplicate)', 'blockera')}
							</Flex>
						</MenuItem>
					) : (
						<Tooltip
							text={__('Clone', 'blockera')}
							style={{
								'--tooltip-bg':
									'var(--blockera-controls-primary-color)',
							}}
							delay={300}
						>
							<Button
								className={controlInnerClassNames('btn-clone')}
								noBorder={true}
								icon={<Icon icon="clone" iconSize={20} />}
								onClick={cloneFunction}
								aria-label={sprintf(
									// translators: %s is the repeater item id. It's aria label for cloning repeater item
									__('Clone %s', 'blockera'),
									getArialLabelSuffix(itemId)
								)}
							/>
						</Tooltip>
					)}
				</>
			)}

			{showReset && (
				<>
					{actionButtonsType === 'menu' ? (
						<MenuItem
							onClick={resetFunction}
							className={classNames('blockera-block-menu-item')}
							style={{
								'--blockera-controls-primary-color': '#e20b0b',
								'--wp-components-color-accent': '#e20b0b',
							}}
						>
							<Flex
								alignItems="center"
								gap="10px"
								data-test="reset-button"
							>
								<Icon icon="undo" iconSize={20} />
								{__('Reset', 'blockera')}
							</Flex>
						</MenuItem>
					) : (
						<Tooltip
							text={__('Reset', 'blockera')}
							style={{
								'--tooltip-bg': '#e20b0b',
							}}
							delay={300}
						>
							<Button
								className={controlInnerClassNames('btn-delete')}
								noBorder={true}
								icon={<Icon icon="undo" iconSize={20} />}
								onClick={resetFunction}
								aria-label={sprintf(
									// translators: %s is the repeater item id. It's aria label for deleting repeater item
									__('Reset %s', 'blockera'),
									getArialLabelSuffix(itemId)
								)}
								style={{
									'--blockera-controls-primary-color':
										'#e20b0b',
								}}
							/>
						</Tooltip>
					)}
				</>
			)}

			{showDelete && (
				<>
					{actionButtonsType === 'menu' ? (
						<MenuItem
							onClick={deleteFunction}
							className={classNames({
								'blockera-block-menu-item': true,
							})}
							style={{
								'--blockera-controls-primary-color': '#e20b0b',
								'--wp-components-color-accent': '#e20b0b',
							}}
						>
							<Flex alignItems="center" gap="10px">
								<Icon library="ui" icon="trash" iconSize={20} />
								{__('Delete', 'blockera')}
							</Flex>
						</MenuItem>
					) : (
						<Tooltip
							text={__('Delete', 'blockera')}
							style={{
								'--tooltip-bg': '#e20b0b',
							}}
							delay={300}
						>
							<Button
								className={controlInnerClassNames('btn-delete')}
								noBorder={true}
								icon={<Icon icon="trash" iconSize={20} />}
								onMouseDown={(event: MouseEvent) => {
									event.stopPropagation();
								}}
								onClick={deleteFunction}
								aria-label={sprintf(
									// translators: %s is the repeater item id. It's aria label for deleting repeater item
									__('Delete %s', 'blockera'),
									getArialLabelSuffix(itemId)
								)}
								style={{
									'--blockera-controls-primary-color':
										'#e20b0b',
								}}
							/>
						</Tooltip>
					)}
				</>
			)}
		</>
	);
}
