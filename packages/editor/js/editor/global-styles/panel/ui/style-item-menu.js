// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { __experimentalDivider as Divider } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	Flex,
	Grid,
	Popover,
	Button,
	ToggleControl,
	ControlContextProvider,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { RenameModal } from './rename-modal';
import { DeleteModal } from './delete-modal';
import { DuplicateModal } from './duplicate-modal';
import { UsageForMultipleBlocksModal } from './usage-for-multiple-blocks';
import { useStyleItemMenuContext } from '../context';

export const StyleItemMenu = (): MixedElement => {
	const {
		blockName,
		blockTitle,
		cachedStyle,
		isOpenRenameModal,
		isOpenDeleteModal,
		isOpenDuplicateModal,
		setIsOpenDeleteModal,
		setIsOpenRenameModal,
		setIsOpenDuplicateModal,
		isOpenContextMenu,
		setIsOpenContextMenu,
		style,
		buttonText,
		handleOnRename,
		handleOnDuplicate,
		handleOnClearAllCustomizations,
		handleOnUsageForMultipleBlocks,
		handleOnSaveUsageForMultipleBlocks,
		setIsOpenUsageForMultipleBlocks,
		isOpenUsageForMultipleBlocks,
		handleOnEnable,
		handleOnDelete,
		isConfirmedChangeID,
		setIsConfirmedChangeID,
		blockStyles,
		handlePromotionPopover,
		anchorRef,
		popoverOffset,
		variationAllowsMultipleBlocks,
	} = useStyleItemMenuContext();

	const inactiveLabel = variationAllowsMultipleBlocks
		? __('Inactive Style', 'blockera')
		: __('Inactive Size', 'blockera');

	const activeLabel = variationAllowsMultipleBlocks
		? __('Active Style', 'blockera')
		: __('Active Size', 'blockera');

	return (
		<>
			{isOpenRenameModal && !style?.isDefault && (
				<RenameModal
					style={style}
					buttonText={buttonText}
					blockStyles={blockStyles}
					handleOnRename={handleOnRename}
					isConfirmedChangeID={isConfirmedChangeID}
					setIsOpenRenameModal={setIsOpenRenameModal}
					setIsConfirmedChangeID={setIsConfirmedChangeID}
				/>
			)}
			{isOpenDeleteModal && (
				<DeleteModal
					style={style}
					handleOnDelete={handleOnDelete}
					setIsOpenDeleteModal={setIsOpenDeleteModal}
				/>
			)}
			{isOpenDuplicateModal && (
				<DuplicateModal
					style={style}
					buttonText={buttonText}
					handleOnDuplicate={handleOnDuplicate}
					isConfirmedChangeID={isConfirmedChangeID}
					setIsOpenDuplicateModal={setIsOpenDuplicateModal}
					setIsConfirmedChangeID={setIsConfirmedChangeID}
					blockStyles={blockStyles}
				/>
			)}
			{variationAllowsMultipleBlocks && isOpenUsageForMultipleBlocks && (
				<UsageForMultipleBlocksModal
					style={style}
					blockName={blockName}
					blockTitle={blockTitle}
					handleOnUsageForMultipleBlocks={
						handleOnUsageForMultipleBlocks
					}
					handleOnSaveUsageForMultipleBlocks={
						handleOnSaveUsageForMultipleBlocks
					}
					setIsOpenUsageForMultipleBlocks={
						setIsOpenUsageForMultipleBlocks
					}
				/>
			)}

			{isOpenContextMenu && (
				<Popover
					anchor={anchorRef?.current}
					title={''}
					offset={popoverOffset}
					draggable={true}
					placement="left-start"
					className="variations-settings-popover"
					onClose={() => {
						setIsOpenContextMenu(false);
					}}
				>
					<Flex direction="column" gap={2}>
						<span />
						<Button
							variant="link"
							contentAlign="left"
							className={controlInnerClassNames('menu-item')}
							onClick={() => {
								const canDuplicateItem =
									handlePromotionPopover();

								if (canDuplicateItem) {
									setIsOpenDuplicateModal(true);
								}
							}}
						>
							<Icon icon="duplicate" iconSize="24" />
							{__('Duplicate', 'blockera')}
						</Button>

						<Button
							variant="link"
							contentAlign="left"
							className={controlInnerClassNames('menu-item')}
							onClick={() =>
								handleOnClearAllCustomizations(style)
							}
						>
							<Icon icon="undo" iconSize="24" />
							{__('Clear all customizations', 'blockera')}
						</Button>

						{!style?.isDefault && (
							<Button
								variant="link"
								contentAlign="left"
								className={controlInnerClassNames('menu-item')}
								onClick={() => {
									if (isOpenRenameModal) {
										return setIsOpenRenameModal(false);
									}

									setIsOpenRenameModal(true);
								}}
							>
								<Icon icon="pen" iconSize="24" />
								{__('Rename', 'blockera')}
							</Button>
						)}

						{variationAllowsMultipleBlocks && !style?.isDefault && (
							<Button
								variant="link"
								contentAlign="left"
								className={controlInnerClassNames('menu-item')}
								onClick={() => {
									if (isOpenRenameModal) {
										return setIsOpenUsageForMultipleBlocks(
											false
										);
									}

									setIsOpenUsageForMultipleBlocks(true);
								}}
							>
								<Icon icon="block-types" iconSize="24" />
								{__('Use for multiple blocks', 'blockera')}
							</Button>
						)}

						<Grid
							gridTemplateColumns="24px 1fr"
							gap={8}
							alignItems="center"
							style={{
								padding: '0 6px',
								height: '28px',
								'font-size': '11px',
								color: '#7A7A7A',
								background: '#f6f6f6',
								'align-items': 'center',
								'border-radius': '2px',
								margin: '6px 0 4px',
								'font-family': 'Consolas, Monaco, monospace',
								'unicode-bidi': 'embed',
							}}
						>
							<span
								style={{
									'text-align': 'center',
								}}
							>
								ID:
							</span>
							{style.name}
						</Grid>

						{!style.isDefault && (
							<Divider
								style={{
									color: '#e6e6e6',
									margin: '12px -16px 8px',
								}}
							/>
						)}

						{!style?.isDefault && (
							<Grid
								gridTemplateColumns="24px 1fr"
								gap={8}
								alignItems="center"
								style={{
									padding: '0 6px',
									height: '36px',
								}}
							>
								<ControlContextProvider
									value={{
										name: `${style.name}-toggle`,
										value:
											true === cachedStyle?.status ||
											!cachedStyle.hasOwnProperty(
												'status'
											),
									}}
								>
									<ToggleControl
										labelType={'self'}
										label={' '}
										onChange={(value: boolean): void =>
											handleOnEnable(value, style)
										}
										size="small"
									/>
								</ControlContextProvider>

								{false === cachedStyle?.status
									? inactiveLabel
									: activeLabel}
							</Grid>
						)}

						{!style.isDefault && (
							<Button
								variant="link"
								contentAlign="left"
								className={controlInnerClassNames('menu-item')}
								onClick={() => {
									setIsOpenDeleteModal(true);
								}}
								style={{
									'--blockera-controls-primary-color':
										'#e20b0b',
								}}
							>
								<Icon icon="trash" iconSize="24" />
								{__('Delete', 'blockera')}
							</Button>
						)}
					</Flex>
				</Popover>
			)}
		</>
	);
};
