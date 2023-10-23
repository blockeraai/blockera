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

const RepeaterItem = ({ item, itemId }) => {
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
		popoverLabel,
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

	const handleDragStart = (e, index) => {
		e.dataTransfer.setData('text/plain', index);
		setDraggingIndex(index);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
	};

	const handleDragEnter = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e, index) => {
		e.preventDefault();

		setDraggingIndex(index);

		const toIndex = index;
		const { sortRepeaterItem } = dispatch;
		const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

		sortRepeaterItem({
			controlId,
			items,
			fromIndex,
			toIndex,
			repeaterId,
		});
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
				popoverLabel={popoverLabel}
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
					<RepeaterItemActions {...repeaterItemActionsProps} />
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

export default memo(RepeaterItem);
