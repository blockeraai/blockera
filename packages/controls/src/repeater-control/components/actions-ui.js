/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../context';
import DeleteIcon from './../icons/delete';
import EnableIcon from './../icons/enable';
import DisableIcon from './../icons/disable';
import CloneIcon from './../icons/clone';
import { isOpenPopoverEvent } from '../utils';

export default function ActionsUI({
	item,
	itemId,
	isOpen,
	setOpen,
	isVisible,
	setVisibility,
}) {
	const {
		removeItem,
		changeItem,
		cloneItem,
		isPopover,
		maxItems,
		repeaterItems,
	} = useContext(RepeaterContext);

	return (
		<>
			{!isPopover && (
				<Button
					className={controlInnerClassNames('btn-toggle')}
					icon={isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'}
					label={
						isOpen
							? __('Close Settings', 'publisher')
							: __('Open Settings', 'publisher')
					}
					showTooltip={true}
					onClick={(event) =>
						!isOpenPopoverEvent(event) && setOpen(!isOpen)
					}
				/>
			)}

			<div className={controlInnerClassNames('action-btns')}>
				<Button
					className={controlInnerClassNames(
						'btn-visibility',
						'no-border'
					)}
					icon={isVisible ? EnableIcon : DisableIcon}
					showTooltip={true}
					onClick={(event) => {
						if (isOpenPopoverEvent(event)) {
							return;
						}

						setVisibility(!isVisible);
						changeItem(itemId, {
							...item,
							isVisible: !isVisible,
						});
					}}
					label={
						isVisible
							? __('Disable', 'publisher')
							: __('Enable', 'publisher')
					}
				/>

				{(maxItems === -1 || repeaterItems?.length < maxItems) && (
					<Button
						className={controlInnerClassNames(
							'btn-clone',
							'no-border'
						)}
						icon={CloneIcon}
						showTooltip={true}
						label={__('Clone', 'publisher')}
						onClick={(event) =>
							!isOpenPopoverEvent(event) && cloneItem(itemId)
						}
					/>
				)}

				<Button
					className={controlInnerClassNames(
						'btn-delete',
						'no-border'
					)}
					icon={DeleteIcon}
					showTooltip={true}
					onClick={(event) =>
						!isOpenPopoverEvent(event) && removeItem(itemId)
					}
					label={__('Delete', 'publisher')}
				/>
			</div>
		</>
	);
}
