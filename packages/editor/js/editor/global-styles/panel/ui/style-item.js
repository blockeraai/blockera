// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { dispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useMemo, useEffect } from '@wordpress/element';
import {
	Fill,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { isEquals } from '@blockera/utils';
import { Flex, Button, ChangeIndicator, Tooltip } from '@blockera/controls';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getDefaultStyle } from './utils';
import { type T_STYLE_ITEM_PROPS } from './types';
import { StyleItemMenu } from './style-item-menu';
import { useBlockStyleItem } from './use-block-style-item';
import { useUserCan } from '../../../../hooks/use-user-can';
import {
	useGlobalStylesPanelContext,
	useBlockStylesPickerContext,
	StyleItemMenuContextProvider,
} from '../context';

export const StyleItem = ({
	style,
	inGlobalStylesPanel = false,
}: $Shape<T_STYLE_ITEM_PROPS>): MixedElement => {
	const pickerContext = useBlockStylesPickerContext();
	const {
		blockName,
		counter,
		counterMap,
		setCounter,
		activeStyle,
		blockStyles,
		setBlockStyles,
		setCurrentActiveStyle,
		handlePromotionPopover,
		onSelectStylePreview,
		setCurrentPreviewStyle,
		styleItemHandler,
		originDefaultAttributes,
		hasChangesets,
		setChangesets,
	} = pickerContext;
	const {
		defaultStyles,
		getStyle = () => ({}),
		getStyleVariationBlocks,
		resetBlockStateToNormal,
		deleteStyleVariationBlocks,
		setStyleVariationBlocks,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
		setStyle: setStyleData = () => {},
	} = useGlobalStylesPanelContext();
	const initializedCachedStyle = useSelect(
		(select) => {
			const storeSelect = select('blockera/editor');
			if (!storeSelect) {
				return {};
			}

			const metaData =
				storeSelect.getBlockeraGlobalStylesMetaData?.() ?? {};
			const variations = metaData?.blocks?.[blockName]?.variations || {};

			if (Object.keys(variations).length > 0) {
				for (const variation in variations) {
					if (variations[variation]?.refId === style.name) {
						return variations[variation];
					}
					if (variation === style.name) {
						return variations[variation];
					}
				}
			}

			// Outside panel: style is in list only if enabled (getRenderedStyles filters).
			// When metadata lookup fails, assume enabled so we don't hide it.
			if (!inGlobalStylesPanel) {
				return { status: true };
			}

			return {};
		},
		[blockName, style.name, inGlobalStylesPanel]
	);

	const [cachedStyle, setCachedStyle] = useState(initializedCachedStyle);

	useEffect(() => {
		if (!isEquals(cachedStyle, initializedCachedStyle)) {
			setCachedStyle(initializedCachedStyle);
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initializedCachedStyle]);

	const buttonText = useMemo(() => {
		return (
			cachedStyle?.label ||
			style.label ||
			style.name ||
			__('Default', 'blockera')
		);
	}, [cachedStyle, style]);

	const [isOpenContextMenu, setIsOpenContextMenu] = useState(false);
	const [isOpenRenameModal, setIsOpenRenameModal] = useState(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState(false);
	const [isOpenUsageForMultipleBlocks, setIsOpenUsageForMultipleBlocks] =
		useState(false);
	const [isOpenBlockCardContextMenu, setIsOpenBlockCardContextMenu] =
		useState(false);
	const [isOpenBlockCardRenameModal, setIsOpenBlockCardRenameModal] =
		useState(false);
	const [isOpenBlockCardDeleteModal, setIsOpenBlockCardDeleteModal] =
		useState(false);
	const [isOpenBlockCardDuplicateModal, setIsOpenBlockCardDuplicateModal] =
		useState(false);
	const [
		isOpenBlockCardUsageForMultipleBlocks,
		setIsOpenBlockCardUsageForMultipleBlocks,
	] = useState(false);

	const {
		handleOnEnable,
		handleOnDelete,
		handleOnRename,
		handleOnDuplicate,
		handleOnDetachStyle,
		isConfirmedChangeID,
		setIsConfirmedChangeID,
		handleOnSaveCustomizations,
		handleOnUsageForMultipleBlocks,
		handleOnSaveUsageForMultipleBlocks,
		handleOnClearAllCustomizations,
	} = useBlockStyleItem({
		style,
		counter,
		blockName,
		counterMap,
		setCounter,
		blockStyles,
		cachedStyle,
		defaultStyles,
		setBlockStyles,
		setCachedStyle,
		styles: getStyle(),
		inGlobalStylesPanel,
		onSelectStylePreview,
		setIsOpenContextMenu,
		setCurrentActiveStyle,
		setStyles: setStyleData,
		setStyleVariationBlocks,
		getStyleVariationBlocks,
		deleteStyleVariationBlocks,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
	});

	const isUserCanSaveCustomizations = useUserCan('root', 'globalStyles');

	// When not in global styles panel,
	// skip rendering if style is disabled.
	if (
		!inGlobalStylesPanel &&
		cachedStyle?.hasOwnProperty('status') &&
		!cachedStyle.status
	) {
		return <></>;
	}

	const isActive: boolean = activeStyle.name === style.name;

	const defaultStyle = getDefaultStyle(blockStyles);

	const activeInBlocks = getStyleVariationBlocks(style.name);

	return (
		<>
			<div
				role="button"
				tabIndex={0}
				className={classNames(
					'block-editor-block-styles__item__button',
					{
						'is-active':
							inGlobalStylesPanel && !currentBlockStyleVariation
								? false
								: isActive,
						'is-focus': isOpenBlockCardContextMenu,
						'is-enabled':
							!cachedStyle?.hasOwnProperty('status') ||
							true === cachedStyle?.status,
					}
				)}
				key={style.name}
				label={
					style?.isDefault && style?.name !== 'default'
						? buttonText + ` (${__('Default', 'blockera')})`
						: ''
				}
				onMouseEnter={() => {
					// Skip mouse enter if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip mouse enter if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(style);
				}}
				onFocus={() => {
					// Skip focus if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip focus if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(style);
				}}
				onMouseLeave={() => {
					// Skip mouse leave if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip mouse leave if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(null);
				}}
				onBlur={() => {
					// Skip blur if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip blur if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					setCurrentPreviewStyle(null);
					styleItemHandler(null);
				}}
				onClick={(event) => {
					// Skip blur if style is disabled.
					if (false === cachedStyle?.status) {
						return;
					}

					// Skip click on actions opener element.
					if (
						!event.target.innerText ||
						-1 === event.target.innerText.indexOf(style.label)
					) {
						return;
					}

					if (inGlobalStylesPanel) {
						// Navigate to the block style variation customization panel when clicked in global styles context.
						resetBlockStateToNormal();

						const { setSelectedBlockStyleVariation } =
							dispatch('blockera/editor');

						setSelectedBlockStyleVariation(style);
						setCurrentActiveStyle(style);
						return setCurrentBlockStyleVariation(style);
					}

					onSelectStylePreview(style);
				}}
				onKeyDown={(event) => {
					// Handle Enter key press
					if (event.key !== 'Enter') {
						return;
					}

					if (inGlobalStylesPanel) {
						// Navigate to the block style variation customization panel when Enter is pressed in global styles context.

						const { setSelectedBlockStyleVariation } =
							dispatch('blockera/editor');

						setSelectedBlockStyleVariation(style);
						setCurrentActiveStyle(style);
						return setCurrentBlockStyleVariation(style);
					}

					onSelectStylePreview(style);
				}}
				aria-current={isActive}
				data-test={`style-${style.name}`}
			>
				<Flex
					alignItems={'center'}
					justifyContent={'flex-start'}
					className="block-editor-block-styles__item-text"
					gap={2}
				>
					<Truncate numberOfLines={1}>{buttonText}</Truncate>

					{!inGlobalStylesPanel && isActive && (
						<Icon icon="check" library="wp" iconSize="20" />
					)}

					{inGlobalStylesPanel &&
						currentBlockStyleVariation &&
						isActive && <Icon icon="pen" iconSize="18" />}

					<Flex
						gap={4}
						alignItems={'center'}
						style={{ marginLeft: 'auto' }}
					>
						{defaultStyle && style.isDefault && (
							<Tooltip
								text={__(
									'Default style variation used globally for all blocks',
									'blockera'
								)}
							>
								<Icon
									icon="asterisk"
									iconSize="16"
									style={{
										opacity: '0.4',
									}}
								/>
							</Tooltip>
						)}

						{false === cachedStyle?.status && (
							<Tooltip
								text={__(
									'This style variation is disabled',
									'blockera'
								)}
								style={{
									'--tooltip-bg': !isActive
										? '#e20b0b'
										: '#000000',
								}}
							>
								<Icon
									icon="eye-hide"
									iconSize="20"
									style={{
										color: !isActive
											? '#e20b0b'
											: 'currentColor',
									}}
								/>
							</Tooltip>
						)}

						{!style?.isDefault && activeInBlocks.length > 1 && (
							<Flex
								gap={0}
								direction="row"
								style={{ position: 'relative' }}
							>
								{activeInBlocks
									.slice(0, 3)
									.map((block, index) => {
										const { icon = null, title } =
											getBlockType(block);

										return (
											<Tooltip
												key={`${block}-${index}`}
												text={sprintf(
													/* translators: %1$s: The block title. */
													__(
														'This style variation is used in the "%1$s" block',
														'blockera'
													),
													title
												)}
												style={{
													'--tooltip-bg': !isActive
														? '#e20b0b'
														: '#000000',
												}}
											>
												<div
													className="circle-multiple-blocks"
													style={{
														marginRight: '4px',
													}}
												>
													{icon.src}
												</div>
											</Tooltip>
										);
									})}
								<div className="circle-multiple-blocks">
									{activeInBlocks.length}
								</div>
							</Flex>
						)}

						{style.icon && (
							<Tooltip
								text={
									style.icon.name === 'blockera'
										? __(
												'Style variation added or customized by Blockera',
												'blockera'
											)
										: __(
												'Style variation from theme or block editor',
												'blockera'
											)
								}
							>
								<Icon
									icon={style.icon.name}
									library={style.icon.library}
									iconSize="16"
									style={{
										opacity: '0.4',
										'margin-right': '-4px',
										position: 'relative',
										'z-index': '10',
									}}
								/>
							</Tooltip>
						)}

						<span
							className="context-menu-trigger"
							data-test={`open-${style.name}-contextmenu`}
						>
							<Icon
								icon="more-vertical"
								iconSize="20"
								onClick={() => setIsOpenContextMenu(true)}
								style={{
									opacity: '0.4',
								}}
							/>
						</span>
					</Flex>
				</Flex>

				<StyleItemMenuContextProvider
					value={{
						blockTitle: getBlockType(blockName).title,
						style,
						counter,
						handlePromotionPopover,
						isOpenDeleteModal,
						setIsOpenDeleteModal,
						isOpenDuplicateModal,
						setIsOpenDuplicateModal,
						blockName,
						setCounter,
						buttonText,
						handleOnRename,
						handleOnDuplicate,
						handleOnClearAllCustomizations,
						handleOnEnable,
						handleOnDelete,
						handleOnUsageForMultipleBlocks,
						handleOnSaveUsageForMultipleBlocks,
						isConfirmedChangeID,
						setIsOpenUsageForMultipleBlocks,
						isOpenUsageForMultipleBlocks,
						setIsConfirmedChangeID,
						cachedStyle,
						isOpenRenameModal,
						setIsOpenRenameModal,
						isOpenContextMenu,
						setIsOpenContextMenu,
						setCurrentBlockStyleVariation,
						blockStyles,
					}}
				>
					<StyleItemMenu />
				</StyleItemMenuContextProvider>
			</div>

			{isActive && (
				<Fill name="block-inspector-style-actions">
					<Button
						disabled={
							false === cachedStyle?.status ||
							!hasChangesets ||
							!isUserCanSaveCustomizations
						}
						className={classNames('action-save-customizations', {
							'action-disabled': false,
						})}
						variant="tertiary"
						onClick={() => {
							handleOnSaveCustomizations(
								style,
								originDefaultAttributes
							);

							if ('function' === typeof setChangesets) {
								setChangesets(false);
							}
						}}
						size="input"
						data-test={'save-customizations'}
						style={{
							gap: '4px',
							padding: '2px 0',
							'letter-spacing': '-0.2px',
						}}
					>
						<Icon icon="save" iconSize="18" />

						{__('Save Changes to Style Variation', 'blockera')}

						{hasChangesets && (
							<ChangeIndicator
								isChanged={hasChangesets}
								isAnimated={true}
								primaryColor={'#1ca120'}
								size={'5'}
							/>
						)}
					</Button>

					<Flex gap="8px" justifyContent="space-between">
						<Button
							disabled={false === cachedStyle?.status}
							className={classNames(
								'action-save-customizations',
								{
									'action-disabled': false,
									'block-styles-actions': true,
								}
							)}
							variant="tertiary"
							onClick={() => handleOnDetachStyle(style)}
							size="input"
							data-test={'save-customizations'}
							style={{
								gap: '2px',
								padding: '2px 0',
								'letter-spacing': '-0.2px',
							}}
						>
							<Icon icon="unlink" iconSize="18" />

							{__('Detach Style', 'blockera')}
						</Button>

						<Button
							disabled={!isUserCanSaveCustomizations}
							className={classNames(
								'action-save-customizations',
								{
									'action-disabled': false,
									'block-styles-actions': true,
								}
							)}
							variant="tertiary"
							onClick={() => {
								const canDuplicateItem =
									handlePromotionPopover();

								if (canDuplicateItem) {
									setIsOpenDuplicateModal(true);
								}
							}}
							size="input"
							data-test={'duplicate-item'}
							style={{
								gap: '2px',
								padding: '2px 0',
								'letter-spacing': '-0.2px',
							}}
						>
							<Icon icon="clone" iconSize="18" />

							{__('Duplicate', 'blockera')}
						</Button>
					</Flex>
				</Fill>
			)}

			<Fill
				name={`blockera-style-variation-block-card-menu-${style.name}`}
			>
				{isUserCanSaveCustomizations && (
					<Flex alignItems={'center'} gap={0}>
						{false === cachedStyle?.status && (
							<Icon
								icon="eye-hide"
								iconSize="20"
								style={{
									color: '#e20b0b',
									cursor: 'initial',
								}}
							/>
						)}

						<span
							className="context-menu-trigger"
							data-test={`open-${style.name}-contextmenu`}
						>
							<Icon
								iconSize="20"
								icon="more-vertical"
								onClick={() => setIsOpenContextMenu(true)}
							/>
						</span>

						<StyleItemMenuContextProvider
							value={{
								blockTitle: getBlockType(blockName).title,
								style,
								counter,
								handlePromotionPopover,
								isOpenDeleteModal: isOpenBlockCardDeleteModal,
								setIsOpenDeleteModal:
									setIsOpenBlockCardDeleteModal,
								isOpenDuplicateModal:
									isOpenBlockCardDuplicateModal,
								setIsOpenDuplicateModal:
									setIsOpenBlockCardDuplicateModal,
								blockName,
								setCounter,
								buttonText,
								handleOnRename,
								handleOnDuplicate,
								handleOnClearAllCustomizations,
								handleOnEnable,
								handleOnDelete,
								handleOnUsageForMultipleBlocks,
								handleOnSaveUsageForMultipleBlocks,
								isConfirmedChangeID,
								setIsOpenUsageForMultipleBlocks:
									setIsOpenBlockCardUsageForMultipleBlocks,
								isOpenUsageForMultipleBlocks:
									isOpenBlockCardUsageForMultipleBlocks,
								setIsConfirmedChangeID,
								cachedStyle,
								isOpenRenameModal: isOpenBlockCardRenameModal,
								setIsOpenRenameModal:
									setIsOpenBlockCardRenameModal,
								isOpenContextMenu: isOpenBlockCardContextMenu,
								setIsOpenContextMenu:
									setIsOpenBlockCardContextMenu,
								setCurrentBlockStyleVariation,
								blockStyles,
							}}
						>
							<StyleItemMenu />
						</StyleItemMenuContextProvider>
					</Flex>
				)}
			</Fill>
		</>
	);
};
