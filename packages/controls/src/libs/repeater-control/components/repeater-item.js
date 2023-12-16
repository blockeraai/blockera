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
import { isBoolean } from '@publisher/utils';
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

const RepeaterItem = ({ item, itemId }: RepeaterItemProps): Element<any> => {
	const [isOpen, setOpen] = useState(
		isBoolean(item?.isOpen) ? item?.isOpen : false
	);
	const [isVisible, setVisibility] = useState(
		isBoolean(item?.isVisible) ? item.isVisible : true
	);

	const {
		controlInfo: { name: controlId },
		dispatch,
	} = useControlContext();

	const {
		mode,
		design,
		repeaterId,
		popoverTitle,
		popoverClassName,
		repeaterItems: items,
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
			const { sortRepeaterItem } = dispatch;
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
				mode={mode}
				toggleOpenBorder={true}
				design={design}
				popoverTitle={popoverTitle}
				popoverClassName={popoverClassName}
				className={controlInnerClassNames(
					'repeater-item-group',
					item?.__className
				)}
				header={
					!RepeaterItemHeader ? (
						<div
							className={controlInnerClassNames(
								'repeater-group-header'
							)}
							onClick={(event) =>
								isOpenPopoverEvent(event) && setOpen(!isOpen)
							}
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
				headerOpenButton={false}
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
				}}
			/>
		</div>
	);
};

// $FlowFixMe
export default memo<RepeaterItemProps>(RepeaterItem);
