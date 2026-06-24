// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	memo,
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
	getArialLabelSuffix,
	isOpenPopoverEvent,
	isRepeaterPromoActive,
	shouldApplyRepeaterItemNativeStyle,
	shouldGateRepeaterItemHeaderForPromo,
} from '../utils';
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
	// Start closed; open via effect when item is new (isOpen/creatingStep) so focus-outside
	// suppression is armed before the popover mounts.
	const [isOpen, setOpen] = useState(false);
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

	const repeaterItemActionsProps = {
		item,
		itemId,
		isOpen,
		setOpen,
		isVisible,
		setVisibility,
		isOpenPopoverEvent,
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
	const scrollBehavior = useReducedMotion() ? 'auto' : 'smooth';
	const [draggingIndex, setDraggingIndex] = useState(null);
	const [variationsAccordionOpen, setVariationsAccordionOpen] =
		useState(false);
	const isPendingOpenItem = pendingOpenItemId === itemId;
	const shouldSuppressInitialFocusOutsideRef = useRef(
		item?.creatingStep === true || isPendingOpenItem
	);
	const suppressPopoverFocusOutsideRef = useRef(
		shouldSuppressInitialFocusOutsideRef.current
	);

	useEffect(() => {
		suppressPopoverFocusOutsideRef.current =
			isOpen &&
			(item?.creatingStep === true ||
				pendingOpenItemId === itemId ||
				shouldSuppressInitialFocusOutsideRef.current);
		if (!isOpen) {
			shouldSuppressInitialFocusOutsideRef.current = false;
		}
	}, [item?.creatingStep, isOpen, pendingOpenItemId, itemId]);

	useEffect(() => {
		styleRef.current = {
			opacity: draggingIndex && draggingIndex !== itemId ? 0.5 : 1,
		};
	}, [draggingIndex, itemId]);

	// New rows open the edit popover in an effect so focus-outside suppression is armed
	// before the popover mounts (pendingOpenItemId / creatingStep survive valueCleanup).
	useEffect(() => {
		if (
			item?.creatingStep !== true &&
			pendingOpenItemId !== itemId &&
			item?.isOpen !== true
		) {
			return;
		}

		setOpen(true);
	}, [item?.creatingStep, item?.isOpen, pendingOpenItemId, itemId]);

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

	const handleItemPopoverClose = () => {
		setOpen(false);
		shouldSuppressInitialFocusOutsideRef.current = false;
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
		}
	};

	const handleDragStart = (e: DragEvent, index: string) => {
		if (e.dataTransfer) {
			e.dataTransfer.setData(
				'text/plain',
				// $FlowFixMe
				e.target.closest('.draggable').getAttribute('data-id')
			);
			setDraggingIndex(index);
		}
	};

	const handleDragOver = (e: MouseEvent) => {
		e.preventDefault();
	};

	const handleDragLeave = (e: MouseEvent) => {
		e.preventDefault();
	};

	const handleDragEnter = (e: MouseEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: DragEvent, index: string) => {
		e.preventDefault();

		if (e.dataTransfer) {
			setDraggingIndex(index);

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
					setOpen(!isOpen);
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
	const mainItemHeaderOpenButton = RepeaterItemOpener?.hasButton
		? RepeaterItemOpener.hasButton(item, itemId)
		: false;
	const mainItemInjectHeaderButtonsStart =
		'popover' === mode ? (
			<RepeaterItemActions
				item={repeaterItemActionsProps.item}
				itemId={repeaterItemActionsProps.itemId}
				isVisible={repeaterItemActionsProps.isVisible}
				setVisibility={repeaterItemActionsProps.setVisibility}
				onOpenItemSettings={() => setOpen(true)}
				showItemEditButton={showItemEditButton}
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
				onOpenItemSettings={() => setOpen(true)}
				showItemEditButton={showItemEditButton}
			/>
		);

	const mainItemGroupSharedProps = {
		mode: isFunction(RepeaterItemChildren?.getMode)
			? RepeaterItemChildren.getMode(item, itemId)
			: mode,
		toggleOpenBorder: true,
		design,
		popoverProps: {
			...(popoverProps || {}),
			focusOutsideSuppressionRef: suppressPopoverFocusOutsideRef,
		},
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
		children: <RepeaterItemChildren {...{ item, itemId }} />,
		isOpen,
		onClose: handleItemPopoverClose,
		onClick: (): void | boolean => {
			if (item?.selectable) {
				if (hasOpenModalOverlay()) {
					return;
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

	return (
		<div
			ref={itemRef}
			className={controlInnerClassNames(
				'repeater-item',
				isVisible ? ' is-active' : ' is-inactive',
				{
					'is-small': rowSize === 'small',
					draggable: !isOpen,
					'is-native': shouldApplyRepeaterItemNativeStyle(
						itemId,
						item,
						items,
						enablePromoCountOnRepeaterItemHeader,
						isPromoActive
					),
				}
			)}
			draggable={!isOpen}
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
						onClick: mainItemGroupSharedProps.onClick,
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
