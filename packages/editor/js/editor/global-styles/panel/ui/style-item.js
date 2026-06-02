// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { dispatch, useSelect } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useState, useMemo, useEffect, useRef } from '@wordpress/element';
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
import { STORE_NAME as BLOCKERA_EDITOR_STORE } from '../../../../store/constants';
import {
	useGlobalStylesPanelContext,
	useBlockStylesPickerContext,
	StyleItemMenuContextProvider,
} from '../context';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
	SIZE_VARIATION_BLOCK_CARD_SLOT_NAME,
} from '../variation-surfaces';
import {
	getStyleVariationBlockCardSlotNames,
	DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME,
} from '../../../../extensions/libs/block-card';

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
		variationSurface: pickerVariationSurface,
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
		variationSurface: panelVariationSurface = VARIATION_SURFACE_STYLE,
	} = useGlobalStylesPanelContext();

	const variationSurface =
		pickerVariationSurface !== undefined &&
		pickerVariationSurface !== null &&
		pickerVariationSurface !== ''
			? pickerVariationSurface
			: panelVariationSurface;
	const initializedCachedStyle = useSelect(
		(select) => {
			const storeSelect = select(BLOCKERA_EDITOR_STORE);
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

	const isSizeVariationUi = variationSurface === VARIATION_SURFACE_SIZE;

	const styleVariationBlockCardSlots = useMemo(
		() =>
			getStyleVariationBlockCardSlotNames(
				isSizeVariationUi
					? SIZE_VARIATION_BLOCK_CARD_SLOT_NAME
					: DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME,
				style.name
			),
		[style.name, isSizeVariationUi]
	);

	const [isOpenContextMenu, setIsOpenContextMenu] = useState(false);
	const [isOpenRenameModal, setIsOpenRenameModal] = useState(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState(false);
	const [isOpenUsageForMultipleBlocks, setIsOpenUsageForMultipleBlocks] =
		useState(false);

	const styleItemContextMenuAnchorRef = useRef(null);

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
		skipBlockStyleRegistry: isSizeVariationUi,
		variationSurface,
	});

	const isUserCanSaveCustomizations = useUserCan('root', 'globalStyles');

	// Must read via the `select` argument so useSelect subscribes to the store.
	// Calling context's getStyleVariationBlocks here (global styles path) bypasses
	// registry.__unstableMarkListeningStores, so the row would not re-render after save.
	const activeInBlocks = useSelect(
		(select) => {
			const fn = select(BLOCKERA_EDITOR_STORE)?.getStyleVariationBlocks;
			const fromStore = fn ? fn(style.name) : null;
			return Array.isArray(fromStore) ? fromStore : [];
		},
		[style.name]
	);

	const usageForMultipleBlocksTooltipText = useMemo(() => {
		const count = activeInBlocks?.length || 0;
		if (count < 2) {
			return null;
		}

		const maxTitles = 6;
		const titles = [];

		for (let i = 0; i < count && titles.length < maxTitles; i++) {
			const blockName = activeInBlocks[i];
			const blockType = getBlockType(blockName);
			const title = blockType?.title || blockName;

			if (title) {
				titles.push(title);
			}
		}

		const formatBlockTitlesList = (items: Array<string>): string => {
			const n = items.length;
			if (n <= 0) {
				return '';
			}
			if (n === 1) {
				return items[0];
			}
			if (n === 2) {
				return sprintf(
					/* translators: %1$s: first item, %2$s: second item */
					__('%1$s and %2$s', 'blockera'),
					items[0],
					items[1]
				);
			}

			let out = '';
			for (let i = 0; i < n; i++) {
				if (i === 0) {
					out = items[0];
					continue;
				}

				if (i === n - 1) {
					out += sprintf(
						/* translators: %1$s: list, %2$s: last item */
						__(', and %2$s', 'blockera'),
						out,
						items[i]
					);
				} else {
					out += ', ' + items[i];
				}
			}

			return out;
		};

		let blocksListItems = titles;

		if (count > maxTitles) {
			const remaining = count - maxTitles;
			const moreLabel = sprintf(
				/* translators: %d: number of remaining blocks */
				_n('%d more', '%d more', remaining, 'blockera'),
				remaining
			);
			blocksListItems = [...titles, moreLabel];
		}

		const blocksList = formatBlockTitlesList(blocksListItems);

		const lead = isSizeVariationUi
			? sprintf(
					/* translators: %d: number of blocks using this size variation */
					_n(
						'This size variation is shared with %d block.',
						'This size variation is shared with %d blocks.',
						count,
						'blockera'
					),
					count
				)
			: sprintf(
					/* translators: %d: number of blocks using this style variation */
					_n(
						'This style variation is shared with %d block.',
						'This style variation is shared with %d blocks.',
						count,
						'blockera'
					),
					count
				);

		return (
			<>
				<div>{lead}</div>
				<div>
					{sprintf(
						/* translators: %s: comma-separated block titles */
						__('Blocks: %s', 'blockera'),
						blocksList
					)}
				</div>
			</>
		);
	}, [activeInBlocks, isSizeVariationUi]);

	// When not in global styles panel,
	// skip rendering if style is disabled.
	if (
		!inGlobalStylesPanel &&
		cachedStyle?.hasOwnProperty('status') &&
		!cachedStyle.status
	) {
		return <></>;
	}

	const isActive: boolean = activeStyle?.name === style.name;
	const defaultStyle = getDefaultStyle(blockStyles);

	const openUsageForMultipleBlocksModal = (event: any) => {
		// Prevent selecting the style item when clicking on usage icons.
		if (event?.preventDefault) {
			event.preventDefault();
		}
		if (event?.stopPropagation) {
			event.stopPropagation();
		}

		// User doesn't have access to manage customizations,
		// so "used in multiple blocks" details should not be interactive.
		if (!isUserCanSaveCustomizations) {
			return;
		}

		setIsOpenContextMenu(false);
		setIsOpenUsageForMultipleBlocks(true);
	};

	const openBlockCardUsageForMultipleBlocksModal = (event: any) => {
		if (event?.preventDefault) {
			event.preventDefault();
		}
		if (event?.stopPropagation) {
			event.stopPropagation();
		}

		if (!isUserCanSaveCustomizations) {
			return;
		}

		setIsOpenUsageForMultipleBlocks(true);
	};

	const renderUsageAcrossBlocksControl = (
		openModal: (event: any) => void,
		variant: 'list-row' | 'block-card'
	): MixedElement | null => {
		if (isSizeVariationUi) {
			return null;
		}

		if (style?.isDefault) {
			return null;
		}

		const interactiveProps = {
			role: 'button',
			'aria-disabled': !isUserCanSaveCustomizations,
			tabIndex: isUserCanSaveCustomizations ? 0 : -1,
			style: {
				position: 'relative',
				pointerEvents: isUserCanSaveCustomizations ? undefined : 'none',
			},
			onClick: openModal,
			onKeyDown: (event: any) => {
				if (!isUserCanSaveCustomizations) {
					return;
				}
				if (event.key !== 'Enter') {
					return;
				}
				openModal(event);
			},
		};

		if (activeInBlocks.length > 1) {
			return (
				<Tooltip text={usageForMultipleBlocksTooltipText}>
					<div
						className="blockera-style-item-multiple-blocks"
						{...interactiveProps}
					>
						<Flex gap={0} direction="row">
							{activeInBlocks.slice(0, 3).map((block, index) => {
								const { icon = null } = getBlockType(block);

								return (
									<div
										key={`${block}-${index}`}
										className="blockera-style-item-multiple-blocks__item"
										style={{
											marginRight: '4px',
										}}
									>
										{icon?.src}
									</div>
								);
							})}
							<div className="blockera-style-item-multiple-blocks__item item-count">
								{activeInBlocks.length}
							</div>
						</Flex>
					</div>
				</Tooltip>
			);
		}

		// Category shortcut to "Share with other blocks" — only for users who can manage it.
		if (!isUserCanSaveCustomizations) {
			return null;
		}

		const useForBlocksLabel = __('Share with other blocks', 'blockera');
		// Match `.blockera-style-item-multiple-blocks__item` svg rules: mb-icon-size − 4px.
		const categoryIconSize = variant === 'block-card' ? '18' : '14';

		const categoryInner = (
			<div
				className="blockera-style-item-multiple-blocks"
				data-test={`${style.name}-usage-for-blocks-trigger`}
				{...interactiveProps}
			>
				<Flex gap={0} direction="row">
					<div className="blockera-style-item-multiple-blocks__item">
						<Icon
							icon="category"
							library="wp"
							iconSize={categoryIconSize}
						/>
					</div>
				</Flex>
			</div>
		);

		return (
			<Tooltip text={useForBlocksLabel}>
				{variant === 'list-row' ? (
					<div className="blockera-style-item-usage-category-trigger--list-row">
						{categoryInner}
					</div>
				) : (
					categoryInner
				)}
			</Tooltip>
		);
	};

	let blockCardAfterPreviewMultipleBlocks: MixedElement | null = null;
	if (!isSizeVariationUi) {
		const blockCardUsageControl = renderUsageAcrossBlocksControl(
			openBlockCardUsageForMultipleBlocksModal,
			'block-card'
		);
		if (blockCardUsageControl) {
			blockCardAfterPreviewMultipleBlocks = (
				<div className="blockera-style-item-multiple-blocks--block-card-row">
					{blockCardUsageControl}
				</div>
			);
		}
	}

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

					// Modals/menus render via portals: the DOM target is outside this row, but
					// React still bubbles the click here. Do not treat those as row clicks (the
					// innerText check below is not enough because modal titles include style.label).
					if (
						event.currentTarget &&
						event.target instanceof Node &&
						!event.currentTarget.contains(event.target)
					) {
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
						resetBlockStateToNormal();

						const editorDispatch = dispatch(BLOCKERA_EDITOR_STORE);

						if (variationSurface === VARIATION_SURFACE_SIZE) {
							editorDispatch.setSelectedBlockSizeVariation(style);
							setCurrentActiveStyle(style);
							return setCurrentBlockStyleVariation(style);
						}

						editorDispatch.setSelectedBlockStyleVariation(style);
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

					// Same as onClick: ignore Enter bubbling from portaled modals/menus.
					if (
						event.currentTarget &&
						event.target instanceof Node &&
						!event.currentTarget.contains(event.target)
					) {
						return;
					}

					if (inGlobalStylesPanel) {
						resetBlockStateToNormal();

						const editorDispatch = dispatch(BLOCKERA_EDITOR_STORE);

						if (variationSurface === VARIATION_SURFACE_SIZE) {
							editorDispatch.setSelectedBlockSizeVariation(style);
							setCurrentActiveStyle(style);
							return setCurrentBlockStyleVariation(style);
						}

						editorDispatch.setSelectedBlockStyleVariation(style);
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
						gap={0}
						alignItems={'center'}
						style={{ marginLeft: 'auto' }}
					>
						{renderUsageAcrossBlocksControl(
							openUsageForMultipleBlocksModal,
							'list-row'
						)}

						{defaultStyle && style.isDefault && (
							<Tooltip
								text={
									isSizeVariationUi ? (
										<>
											<h5>
												{__(
													'The base size variation',
													'blockera'
												)}
											</h5>
											<p>
												{__(
													'Applied when no other size preset is selected for this block type.',
													'blockera'
												)}
											</p>
										</>
									) : (
										<>
											<h5>
												{__(
													'The base style variation',
													'blockera'
												)}
											</h5>
											<p>
												{__(
													'Used by default when no variation is selected. Other variations styles inherit from it.',
													'blockera'
												)}
											</p>
										</>
									)
								}
								style={{
									'--tooltip-width': '300px',
								}}
							>
								<span className="blockera-style-item-main-variation-badge">
									<Icon icon="asterisk" iconSize="16" />
									{__('Base', 'blockera')}
								</span>
							</Tooltip>
						)}

						{false === cachedStyle?.status && (
							<Tooltip
								text={
									isSizeVariationUi
										? __(
												'This size variation is disabled',
												'blockera'
											)
										: __(
												'This style variation is disabled',
												'blockera'
											)
								}
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
										marginLeft: '4px',
									}}
								/>
							</Tooltip>
						)}

						{style.icon?.name === 'blockera' && (
							<Tooltip
								text={
									isSizeVariationUi
										? __(
												'Size variation added or customized by Blockera',
												'blockera'
											)
										: __(
												'Style variation added or customized by Blockera',
												'blockera'
											)
								}
							>
								<Icon
									icon={style.icon.name}
									library={style.icon.library}
									iconSize="18"
									style={{
										opacity: '0.4',
										position: 'relative',
										'z-index': '10',
										marginLeft: '4px',
									}}
								/>
							</Tooltip>
						)}

						{isUserCanSaveCustomizations && (
							<span
								ref={styleItemContextMenuAnchorRef}
								className="context-menu-trigger style-item-context-menu-anchor"
								data-test={`open-${style.name}-contextmenu`}
								data-anchor="style-item-context-menu"
								onClick={() => {
									setIsOpenContextMenu(true);
								}}
							>
								<Icon
									icon="more-vertical"
									iconSize="20"
									style={{
										opacity: '0.4',
									}}
								/>
							</span>
						)}
					</Flex>
				</Flex>

				<StyleItemMenuContextProvider
					value={{
						anchorRef: styleItemContextMenuAnchorRef,
						popoverOffset: 50,
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
						variationAllowsMultipleBlocks:
							variationSurface !== VARIATION_SURFACE_SIZE,
					}}
				>
					<StyleItemMenu />
				</StyleItemMenuContextProvider>
			</div>

			{isActive && (
				<Fill name="block-inspector-style-actions">
					{!isSizeVariationUi && (
						<Button
							disabled={
								false === cachedStyle?.status ||
								!hasChangesets ||
								!isUserCanSaveCustomizations
							}
							className={classNames(
								'action-save-customizations',
								{
									'action-disabled': false,
								}
							)}
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
									primaryColor={
										'var(--blockera-controls-block-variations-style)'
									}
									size={'5'}
								/>
							)}
						</Button>
					)}

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

							{isSizeVariationUi
								? __('Detach Size', 'blockera')
								: __('Detach Style', 'blockera')}
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

			<Fill name={styleVariationBlockCardSlots.afterPreview}>
				{blockCardAfterPreviewMultipleBlocks}
			</Fill>
		</>
	);
};
