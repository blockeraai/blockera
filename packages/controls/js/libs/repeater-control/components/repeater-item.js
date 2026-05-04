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
import { RepeaterContext } from '../context';
import {
	getArialLabelSuffix,
	isEnabledPromote,
	isFirstRepeaterItem,
	isOpenPopoverEvent,
} from '../utils';
import Flex from '../../flex';
import GroupControl from '../../group-control';
import type { RepeaterItemProps } from '../types';
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
}: RepeaterItemProps): null | Element<any> => {
	const [isOpen, setOpen] = useState(
		isBoolean(item?.isOpen) ? item?.isOpen : false
	);
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
		popoverOffset,
		PromoComponent,
		popoverClassName,
		actionButtonsType,
		showItemEditButton,
		repeaterItems: items,
		actionMenuButtonLabel,
		onSelectableItemActivate,
		enablePromoCountOnRepeaterItemHeader,
		repeaterItemOpener: RepeaterItemOpener,
		repeaterItemHeader: RepeaterItemHeader,
		repeaterItemChildren: RepeaterItemChildren,
		repeaterItemVariations: RepeaterItemVariations,
		popoverTitleButtonsRight: PopoverTitleButtonsRight,
	} = useContext(RepeaterContext);

	const { onClick: customHeaderOnClick, ...restCustomProps } =
		customProps || {};

	const bumpPromoInteractionCount = (itemId: string): boolean => {
		if (enablePromoCountOnRepeaterItemHeader === false) {
			return false;
		}

		let shouldBump = false;

		if (true === item?.native) {
			if (isEnabledPromote(PromoComponent, items)) {
				shouldBump = true;
			}
		} else if (
			!item.hasOwnProperty('native') &&
			isEnabledPromote(PromoComponent, items) &&
			!isFirstRepeaterItem(itemId, items)
		) {
			shouldBump = true;
		}

		if (shouldBump) {
			setCount((c) => c + 1);

			return true;
		}

		return false;
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
	const [draggingIndex, setDraggingIndex] = useState(null);
	const [variationsAccordionOpen, setVariationsAccordionOpen] =
		useState(false);

	useEffect(() => {
		styleRef.current = {
			opacity: draggingIndex && draggingIndex !== itemId ? 0.5 : 1,
		};
	}, [draggingIndex, itemId]);

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
				if (bumpPromoInteractionCount(itemId)) {
					event.stopPropagation();
					return;
				}

				if (isOpenPopoverEvent(event)) {
					setOpen(!isOpen);
				}

				const nextOpen = !isOpen;
				changeRepeaterItem({
					itemId,
					value: {
						...item,
						isOpen: nextOpen,
						...(item.creatingStep && !nextOpen
							? { creatingStep: false }
							: {}),
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
				if (bumpPromoInteractionCount(itemId)) {
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
						onBlockedPointerInteraction={() => {
							bumpPromoInteractionCount(itemId);
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
		popoverProps,
		popoverTitle:
			'function' === typeof popoverTitle
				? popoverTitle(itemId, item)
				: popoverTitle,
		popoverOffset,
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
		onClose: () => {
			setOpen(false);

			if (isEnabledPromote(PromoComponent, items)) {
				changeRepeaterItem({
					itemId,
					value: {
						...item,
						isOpen: false,
						...(item.creatingStep ? { creatingStep: false } : {}),
					},
					controlId,
					repeaterId,
				});
				return;
			}

			changeRepeaterItem({
				itemId,
				value: {
					...item,
					isOpen: !isOpen,
					...(item.creatingStep ? { creatingStep: false } : {}),
				},
				controlId,
				repeaterId,
			});
		},
		onClick: (): void | boolean => {
			if (item?.selectable) {
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
					onSelectableItemActivate(itemId, newItems[itemId]);
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
			className={controlInnerClassNames(
				'repeater-item',
				isVisible ? ' is-active' : ' is-inactive',
				{
					draggable: !isOpen,
					'is-native':
						true === item?.native ||
						(enablePromoCountOnRepeaterItemHeader &&
							!isFirstRepeaterItem(itemId, items) &&
							false !== item?.native),
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
			data-test={itemId}
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
					onBlockedPointerInteraction={() => {
						bumpPromoInteractionCount(itemId);
					}}
					enablePromoCountOnRepeaterItemHeader={
						enablePromoCountOnRepeaterItemHeader
					}
				/>
			)}
			{RepeaterItemVariations &&
			showVariations &&
			isBoolean(item?.hasVariations) &&
			item.hasVariations ? (
				<GroupControl
					mode="accordion"
					design={design}
					onClick={() => true}
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
