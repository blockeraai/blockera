// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	memo,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { useReducedMotion } from '@wordpress/compose';
import type { Element, Node } from 'react';

/**
 * Blockera dependencies
 */
import { isBoolean, isFunction } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemActions from './actions';
import { RepeaterProItemInteractionGuard } from './repeater-pro-item-interaction-guard';
import { hasOpenModalOverlay } from '../../modal/overlay-utils';
import { RepeaterContext } from '../context';
import {
	closeInspectorRepeaterPopovers,
	getArialLabelSuffix,
	INSPECTOR_REPEATER_POPOVER_CLOSE_EVENT,
	isClickInsideOpenInspectorRepeaterPopover,
	isOpenPopoverEvent,
	isRepeaterPromoActive,
	shouldApplyRepeaterItemNativeStyle,
	shouldGateRepeaterItemHeaderForPromo,
} from '../utils';
import { isVariablePickerSelectionInteraction } from '../../popover/utils';
import Flex from '../../flex';
import GroupControl from '../../group-control';
import type { RepeaterItemProps, RepeaterItemSize } from '../types';
import { useControlContext } from '../../../context';

export function RepeaterItemVariationsPane({
	children,
}: {
	children: Node,
}): Node {
	return (
		<Flex
			direction="column"
			alignItems="stretch"
			gap="var(--repeater-gap)"
			style={{ width: '100%' }}
			className={controlInnerClassNames('repeater-item-flex')}
		>
			{children}
		</Flex>
	);
}

const RepeaterItem = ({
	item,
	itemId,
	showVariations = true,
	size,
}: RepeaterItemProps): null | Element<any> => {
	const rowSize: RepeaterItemSize = size ?? 'full';
	// Start closed; open via effect when item is new (isOpen/creatingStep).
	const [isOpen, setOpen] = useState(item?.isOpen ?? false);
	const [isVisible, setVisibility] = useState(
		isBoolean(item?.isVisible) ? item.isVisible : true
	);

	const {
		controlInfo: { name: controlId },
		dispatch: { sortRepeaterItem, modifyControlValue, changeRepeaterItem },
	} = useControlContext();

	const {
		mode,
		design,
		onChange,
		setCount,
		repeaterId,
		customProps,
		popoverProps,
		valueCleanup,
		popoverTitle,
		PromoComponent,
		popoverClassName,
		actionButtonsType,
		showItemEditButton,
		repeaterItems: items,
		actionMenuButtonLabel,
		onSelectableItemActivate,
		enablePromoCountOnRepeaterItemHeader,
		disableProHints,
		pendingOpenItemId,
		clearPendingOpenItemId,
		reparentPendingOpenItemId,
		repeaterItemOpener: RepeaterItemOpener,
		repeaterItemHeader: RepeaterItemHeader,
		repeaterItemChildren: RepeaterItemChildren,
		repeaterItemVariations: RepeaterItemVariations,
		popoverTitleButtonsRight: PopoverTitleButtonsRight,
	} = useContext(RepeaterContext);

	const { onClick: customHeaderOnClick, ...restCustomProps } =
		customProps || {};

	const isPromoActive = isRepeaterPromoActive(
		PromoComponent,
		items,
		disableProHints
	);

	const bumpPromoInteractionCount = (): boolean => {
		if (
			!shouldGateRepeaterItemHeaderForPromo(
				itemId,
				item,
				items,
				enablePromoCountOnRepeaterItemHeader,
				isPromoActive
			)
		) {
			return false;
		}

		setCount((c) => c + 1);

		return true;
	};

	let headerVariableSlug: string | void;
	if (!item?.selectable) {
		headerVariableSlug = undefined;
	} else if (
		item.slug !== null &&
		item.slug !== undefined &&
		String(item.slug) !== ''
	) {
		headerVariableSlug = String(item.slug);
	} else if (
		item.id !== null &&
		item.id !== undefined &&
		String(item.id) !== ''
	) {
		headerVariableSlug = String(item.id);
	} else {
		headerVariableSlug = String(itemId);
	}

	const styleRef = useRef(null);
	const itemRef = useRef(null);
	const prevItemIdRef = useRef(itemId);
	const scrollBehavior = useReducedMotion() ? 'auto' : 'smooth';
	const [draggingIndex, setDraggingIndex] = useState(null);
	const [variationsAccordionOpen, setVariationsAccordionOpen] =
		useState(false);
	const [popoverContentKey, setPopoverContentKey] = useState(0);

	const handleItemOpen = useCallback(
		(options?: { refreshContent?: boolean }) => {
			closeInspectorRepeaterPopovers();

			setOpen((currentlyOpen) => {
				const shouldRefreshContent =
					options?.refreshContent ?? !currentlyOpen;

				if (shouldRefreshContent) {
					setPopoverContentKey((key) => key + 1);
				}

				return true;
			});
		},
		[]
	);

	const setOpenWithContentRefresh = useCallback(
		(nextOpen: boolean) => {
			if (nextOpen) {
				handleItemOpen();
				return;
			}

			setOpen(false);
		},
		[handleItemOpen]
	);

	const repeaterItemActionsProps = {
		item,
		itemId,
		isOpen,
		setOpen: setOpenWithContentRefresh,
		isVisible,
		setVisibility,
		isOpenPopoverEvent,
	};

	useEffect(() => {
		styleRef.current = {
			opacity: draggingIndex && draggingIndex !== itemId ? 0.5 : 1,
		};
	}, [draggingIndex, itemId]);

	// New rows open the edit popover via pendingOpenItemId, creatingStep, or store isOpen.
	useEffect(() => {
		if (isOpen) {
			return;
		}

		if (
			pendingOpenItemId !== itemId &&
			item?.isOpen !== true &&
			item?.creatingStep !== true
		) {
			return;
		}

		handleItemOpen({ refreshContent: true });
	}, [
		item?.isOpen,
		item?.creatingStep,
		pendingOpenItemId,
		itemId,
		isOpen,
		handleItemOpen,
	]);

	// Rename-by-type changes itemId while the edit popover is open — keep it open.
	useEffect(() => {
		const previousItemId = prevItemIdRef.current;

		if (previousItemId === itemId) {
			return;
		}

		if (isOpen) {
			if ('function' === typeof reparentPendingOpenItemId) {
				reparentPendingOpenItemId(previousItemId, itemId);
			}

			if (item?.isOpen !== true && item?.creatingStep !== true) {
				changeRepeaterItem({
					itemId,
					value: {
						...item,
						isOpen: true,
					},
					controlId,
					repeaterId,
					onChange,
					valueCleanup,
				});
			}
		}

		prevItemIdRef.current = itemId;
	}, [
		itemId,
		isOpen,
		item,
		controlId,
		repeaterId,
		onChange,
		valueCleanup,
		changeRepeaterItem,
		reparentPendingOpenItemId,
	]);

	// Stable row keys survive delete/reorder — close when this itemId is gone.
	useEffect(() => {
		if (!Object.prototype.hasOwnProperty.call(items, itemId)) {
			setOpen(false);
			clearPendingOpenItemId(itemId);
		}
	}, [items, itemId, clearPendingOpenItemId]);

	// Preset creatingStep rows scroll into the nearest scrollable panel (e.g. variable picker).
	useEffect(() => {
		if (item?.creatingStep !== true) {
			return;
		}

		const node = itemRef.current;
		if (!(node instanceof HTMLElement)) {
			return;
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				node.scrollIntoView({
					inline: 'nearest',
					block: 'center',
					behavior: scrollBehavior,
				});
			});
		});
	}, [item?.creatingStep, itemId, scrollBehavior]);

	const handleItemPopoverClose = useCallback(() => {
		setOpen(false);
		clearPendingOpenItemId(itemId);

		if (item?.creatingStep === true) {
			changeRepeaterItem({
				itemId,
				value: {
					...item,
					creatingStep: false,
				},
				controlId,
				repeaterId,
				onChange,
				valueCleanup,
			});

			return;
		}

		if (item?.isOpen === true) {
			changeRepeaterItem({
				itemId,
				value: {
					...item,
					isOpen: false,
				},
				controlId,
				repeaterId,
				onChange,
				valueCleanup,
			});
		}
	}, [
		item,
		itemId,
		controlId,
		repeaterId,
		onChange,
		valueCleanup,
		changeRepeaterItem,
		clearPendingOpenItemId,
	]);

	useEffect(() => {
		const closeOpenPopover = () => {
			if (!isOpen) {
				return;
			}

			handleItemPopoverClose();
		};

		document.addEventListener(
			INSPECTOR_REPEATER_POPOVER_CLOSE_EVENT,
			closeOpenPopover
		);

		return () => {
			document.removeEventListener(
				INSPECTOR_REPEATER_POPOVER_CLOSE_EVENT,
				closeOpenPopover
			);
		};
	}, [isOpen, handleItemPopoverClose]);

	const handleDragStart = (e: DragEvent, index: string) => {
		if (isOpen) {
			handleItemPopoverClose();
		}

		if (e.dataTransfer) {
			const row = itemRef.current;
			const draggedId =
				row instanceof HTMLElement
					? (row.getAttribute('data-id') ?? index)
					: index;

			e.dataTransfer.setData('text/plain', draggedId);
			setDraggingIndex(index);
		}
	};

	const previewDragReorderInDom = (e: DragEvent) => {
		const transfer = e.dataTransfer;

		if (!transfer) {
			return;
		}

		const fromId = transfer.getData('text/plain');

		if (!fromId || fromId === itemId) {
			return;
		}

		const row = itemRef.current;
		const document = row?.ownerDocument;
		const source = document?.querySelector(
			`[data-cy="repeater-item"][data-id="${fromId}"]`
		);

		if (
			!(source instanceof HTMLElement) ||
			!(row instanceof HTMLElement) ||
			source === row
		) {
			return;
		}

		// Cypress drag-drop checks source position during dragover (before drop).
		row.parentNode?.insertBefore(source, row);
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		previewDragReorderInDom(e);
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
	};

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		previewDragReorderInDom(e);
	};

	const handleDrop = (e: DragEvent, index: string) => {
		e.preventDefault();

		if (e.dataTransfer) {
			const toIndex = index;
			const fromIndex = e.dataTransfer?.getData('text/plain');

			sortRepeaterItem({
				controlId,
				items,
				fromIndex,
				toIndex,
				repeaterId,
				onChange,
				valueCleanup,
			});

			setDraggingIndex(null);
		}
	};

	if (
		isBoolean(item?.renderRepeaterItem) &&
		false === item.renderRepeaterItem
	) {
		return null;
	}

	if (!item?.display && item?.selectable) {
		return null;
	}

	const mainItemGroupHeader = !RepeaterItemHeader ? (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => {
				if (bumpPromoInteractionCount()) {
					event.stopPropagation();
					return;
				}

				if (isOpenPopoverEvent(event)) {
					setOpenWithContentRefresh(!isOpen);
				}

				const nextOpen = !isOpen;

				if (!nextOpen) {
					return;
				}

				changeRepeaterItem({
					itemId,
					value: {
						...item,
						isOpen: true,
					},
					controlId,
					repeaterId,
				});
			}}
			aria-label={sprintf(
				// translators: %s is the repeater item id. It's the aria label for repeater item
				__('Item %s', 'blockera'),
				getArialLabelSuffix(itemId)
			)}
		>
			{sprintf(
				// translators: %s is the repeater item id. It's the repeater item name
				__('Item %s', 'blockera'),
				getArialLabelSuffix(itemId)
			)}
		</div>
	) : (
		<div
			className={controlInnerClassNames('repeater-item-header-holder')}
			style={{ width: '100%' }}
			onClickCapture={(e) => {
				if (bumpPromoInteractionCount()) {
					e.stopPropagation();
					return;
				}

				// Shade strip chips are nested inside this header; skip parent edit
				// handling so child GroupControl rows can select the shade.
				if (
					e.target instanceof Element &&
					e.target.closest(
						'.blockera-component-preset-variable-variations-strip'
					)
				) {
					return;
				}

				if (isFunction(customHeaderOnClick)) {
					customHeaderOnClick(e);
				}
			}}
		>
			<RepeaterItemHeader
				{...repeaterItemActionsProps}
				{...restCustomProps}
				onClick={customHeaderOnClick}
				variationsAccordionOpen={variationsAccordionOpen}
			/>
		</div>
	);

	const mainItemHeaderOpenIcon = RepeaterItemOpener && (
		<RepeaterItemOpener {...repeaterItemActionsProps} />
	);
	const suppressPresetHeaderSettings =
		item?.suppressPresetHeaderSettings === true;
	const mainItemHeaderOpenButton =
		!suppressPresetHeaderSettings && RepeaterItemOpener?.hasButton
			? RepeaterItemOpener.hasButton(item, itemId)
			: false;
	const effectiveShowItemEditButton =
		showItemEditButton && !suppressPresetHeaderSettings;
	const mainItemInjectHeaderButtonsStart =
		'popover' === mode ? (
			<RepeaterItemActions
				item={repeaterItemActionsProps.item}
				itemId={repeaterItemActionsProps.itemId}
				isVisible={repeaterItemActionsProps.isVisible}
				setVisibility={repeaterItemActionsProps.setVisibility}
				onOpenItemSettings={handleItemOpen}
				showItemEditButton={effectiveShowItemEditButton}
				interactionGuard={
					<RepeaterProItemInteractionGuard
						item={item}
						items={items}
						itemId={itemId}
						actionButtonsType={actionButtonsType}
						isPromoActive={isPromoActive}
						onBlockedPointerInteraction={() => {
							bumpPromoInteractionCount();
						}}
						enablePromoCountOnRepeaterItemHeader={
							enablePromoCountOnRepeaterItemHeader
						}
					/>
				}
			/>
		) : (
			<RepeaterItemActions
				item={repeaterItemActionsProps.item}
				itemId={repeaterItemActionsProps.itemId}
				isVisible={repeaterItemActionsProps.isVisible}
				setVisibility={repeaterItemActionsProps.setVisibility}
				onOpenItemSettings={handleItemOpen}
				showItemEditButton={effectiveShowItemEditButton}
			/>
		);

	const mainItemGroupSharedProps = {
		mode: isFunction(RepeaterItemChildren?.getMode)
			? RepeaterItemChildren.getMode(item, itemId)
			: mode,
		toggleOpenBorder: true,
		design,
		popoverProps: popoverProps || {},
		popoverTitle:
			'function' === typeof popoverTitle
				? popoverTitle(itemId, item)
				: popoverTitle,
		popoverTitleButtonsRight: PopoverTitleButtonsRight && (
			<PopoverTitleButtonsRight {...repeaterItemActionsProps} />
		),
		popoverClassName,
		actionButtonsType,
		actionMenuButtonLabel,
		headerVariableSlug,
		className: controlInnerClassNames(
			'repeater-item-group',
			item?.__className,
			{
				'is-selected-item': item?.selectable ? item.isSelected : false,
			}
		),
		children: (
			<RepeaterItemChildren
				key={popoverContentKey}
				{...{ item, itemId }}
			/>
		),
		isOpen,
		onOpen: handleItemOpen,
		onClose: handleItemPopoverClose,
		onClick: (event?: MouseEvent): void | boolean => {
			if (item?.selectable) {
				if (hasOpenModalOverlay()) {
					return;
				}

				if (isClickInsideOpenInspectorRepeaterPopover(event?.target)) {
					return;
				}

				if (!isVariablePickerSelectionInteraction(event?.target)) {
					closeInspectorRepeaterPopovers();
				}

				const newItems: { [key: string]: any } = {};

				Object.entries(items).forEach(
					([_itemId, _item]: [string, any]): void => {
						if (_itemId === itemId) {
							newItems[_itemId] = {
								..._item,
								isSelected: true,
							};

							return;
						}

						newItems[_itemId] = {
							..._item,
							isSelected: false,
						};
					}
				);

				modifyControlValue({
					controlId,
					value: newItems,
				});

				onChange({
					modifyControlValue,
					controlId,
					value: newItems,
				});

				if ('function' === typeof onSelectableItemActivate) {
					const storeRow = newItems[itemId];
					const displaySlug = String(item?.slug ?? '');
					const storeSlug = String(storeRow?.slug ?? '');
					// Shade strip rows share the parent repeater id; merge display item so picker gets the shade slug.
					const activatedRow =
						storeRow &&
						typeof storeRow === 'object' &&
						displaySlug !== '' &&
						displaySlug !== storeSlug
							? { ...storeRow, ...item }
							: storeRow;
					onSelectableItemActivate(itemId, activatedRow);
				}

				return;
			}

			return true;
		},
	};

	const mainItemGroupControl = (
		<GroupControl
			{...mainItemGroupSharedProps}
			header={mainItemGroupHeader}
			headerOpenIcon={mainItemHeaderOpenIcon}
			headerOpenButton={mainItemHeaderOpenButton}
			injectHeaderButtonsStart={mainItemInjectHeaderButtonsStart}
		/>
	);

	const isRowDraggable = !variationsAccordionOpen;

	return (
		<div
			ref={itemRef}
			className={controlInnerClassNames(
				'repeater-item',
				isVisible ? ' is-active' : ' is-inactive',
				{
					'is-small': rowSize === 'small',
					draggable: isRowDraggable,
					'is-native': shouldApplyRepeaterItemNativeStyle(
						itemId,
						item,
						items,
						enablePromoCountOnRepeaterItemHeader,
						isPromoActive
					),
				}
			)}
			draggable={isRowDraggable}
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={(e) => handleDrop(e, itemId)}
			onDragStart={(e) => handleDragStart(e, itemId)}
			data-cy="repeater-item"
			style={styleRef.current}
			data-id={itemId}
			data-test={
				item?.creatingStep === true
					? 'repeater-item-creating-step'
					: itemId
			}
			{...(item?.isSelected
				? {
						onClick: (event: MouseEvent) =>
							mainItemGroupSharedProps.onClick(event),
					}
				: {})}
		>
			{'accordion' === mode && (
				<RepeaterProItemInteractionGuard
					item={item}
					items={items}
					itemId={itemId}
					actionButtonsType={actionButtonsType}
					isPromoActive={isPromoActive}
					onBlockedPointerInteraction={() => {
						bumpPromoInteractionCount();
					}}
					enablePromoCountOnRepeaterItemHeader={
						enablePromoCountOnRepeaterItemHeader
					}
				/>
			)}
			{RepeaterItemVariations &&
			showVariations &&
			isBoolean(item?.hasVariations) &&
			item.hasVariations &&
			true !== item?.listViewCompactShades ? (
				<GroupControl
					mode="accordion"
					design={design}
					onClick={mainItemGroupSharedProps.onClick}
					headerOpenButton={true}
					toggleOpenBorder={true}
					actionButtonsType="inline"
					popoverProps={popoverProps}
					isOpen={variationsAccordionOpen}
					className={controlInnerClassNames(
						'repeater-item-variations-group'
					)}
					onOpen={() => setVariationsAccordionOpen(true)}
					onClose={() => setVariationsAccordionOpen(false)}
					actionMenuButtonLabel={actionMenuButtonLabel}
					header={mainItemGroupHeader}
					headerVariableSlug={headerVariableSlug}
					injectHeaderButtonsStart={mainItemInjectHeaderButtonsStart}
				>
					<RepeaterItemVariationsPane>
						<RepeaterItemVariations {...{ item, itemId }} />
					</RepeaterItemVariationsPane>
				</GroupControl>
			) : (
				mainItemGroupControl
			)}
		</div>
	);
};

// $FlowFixMe
export default memo<RepeaterItemProps>(RepeaterItem);
