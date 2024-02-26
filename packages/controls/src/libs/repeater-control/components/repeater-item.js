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
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { isBoolean, isFunction } from '@publisher/utils';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import RepeaterItemActions from './actions';
import { RepeaterContext } from '../context';
import { isOpenPopoverEvent } from '../utils';
import GroupControl from '../../group-control';
import { useControlContext } from '../../../context';
import type { RepeaterItemProps } from '../types';

const RepeaterItem = ({
	item,
	itemId,
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
		onSelect,
		repeaterId,
		popoverTitle,
		popoverClassName,
		popoverTitleButtonsRight: PopoverTitleButtonsRight,
		repeaterItems: items,
		repeaterItemOpener: RepeaterItemOpener,
		repeaterItemHeader: RepeaterItemHeader,
		repeaterItemChildren: RepeaterItemChildren,
	} = useContext(RepeaterContext);

	const repeaterItemActionsProps = {
		item,
		itemId,
		isOpen,
		setOpen,
		isVisible,
		setVisibility,
		isOpenPopoverEvent,
	};

	const styleRef = useRef(null);
	const [draggingIndex, setDraggingIndex] = useState(null);

	useEffect(() => {
		styleRef.current = {
			opacity: draggingIndex && draggingIndex !== itemId ? 0.5 : 1,
		};
	}, [draggingIndex, itemId]);

	const handleDragStart = (e: DragEvent, index: number) => {
		if (e.dataTransfer) {
			e.dataTransfer.setData('text/plain', index.toString());
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

	const handleDrop = (e: DragEvent, index: number) => {
		e.preventDefault();

		if (e.dataTransfer) {
			setDraggingIndex(index);

			const toIndex = index;
			const fromIndex = parseInt(
				e.dataTransfer?.getData('text/plain'),
				10
			);

			sortRepeaterItem({
				controlId,
				items,
				fromIndex,
				toIndex,
				repeaterId,
			});
		}
	};

	if (!item?.display) {
		return null;
	}

	return (
		<div
			className={controlInnerClassNames(
				'repeater-item',
				'draggable',
				isVisible ? ' is-active' : ' is-inactive'
			)}
			draggable={true}
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={(e) => handleDrop(e, itemId)}
			onDragStart={(e) => handleDragStart(e, itemId)}
			data-cy="repeater-item"
			style={styleRef.current}
		>
			<GroupControl
				mode={
					isFunction(RepeaterItemChildren?.getMode)
						? RepeaterItemChildren.getMode(item, itemId)
						: mode
				}
				toggleOpenBorder={true}
				design={design}
				popoverTitle={popoverTitle}
				popoverTitleButtonsRight={
					PopoverTitleButtonsRight && (
						<PopoverTitleButtonsRight
							{...repeaterItemActionsProps}
						/>
					)
				}
				popoverClassName={popoverClassName}
				className={controlInnerClassNames(
					'repeater-item-group',
					item?.__className,
					{
						'is-selected-item': item.selectable
							? item.isSelected
							: false,
					}
				)}
				header={
					!RepeaterItemHeader ? (
						<div
							className={controlInnerClassNames(
								'repeater-group-header'
							)}
							onClick={(event) => {
								if (isOpenPopoverEvent(event)) setOpen(!isOpen);
								changeRepeaterItem({
									itemId,
									value: {
										...item,
										isOpen: !isOpen,
									},
									controlId,
									repeaterId,
								});
							}}
							aria-label={sprintf(
								// translators: %d is the repeater item id. It's the aria label for repeater item
								__('Item %d', 'publisher-core'),
								itemId + 1
							)}
						>
							{sprintf(
								// translators: %d is the repeater item id. It's the repeater item name
								__('Item %d', 'publisher-core'),
								itemId + 1
							)}
						</div>
					) : (
						<RepeaterItemHeader {...repeaterItemActionsProps} />
					)
				}
				headerOpenIcon={
					RepeaterItemOpener && (
						<RepeaterItemOpener {...repeaterItemActionsProps} />
					)
				}
				headerOpenButton={
					RepeaterItemOpener?.hasButton
						? RepeaterItemOpener.hasButton(item, itemId)
						: false
				}
				injectHeaderButtonsStart={
					<RepeaterItemActions
						item={repeaterItemActionsProps.item}
						itemId={repeaterItemActionsProps.itemId}
						isVisible={repeaterItemActionsProps.isVisible}
						setVisibility={repeaterItemActionsProps.setVisibility}
					/>
				}
				children={<RepeaterItemChildren {...{ item, itemId }} />}
				isOpen={isOpen}
				onClose={() => {
					setOpen(false);
					changeRepeaterItem({
						itemId,
						value: {
							...item,
							isOpen: !isOpen,
						},
						controlId,
						repeaterId,
					});
				}}
				onClick={(event): void | boolean => {
					if (item.selectable) {
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

						return isFunction(onSelect)
							? onSelect(event, item)
							: false;
					}

					return true;
				}}
			/>
		</div>
	);
};

// $FlowFixMe
export default memo<RepeaterItemProps>(RepeaterItem);
