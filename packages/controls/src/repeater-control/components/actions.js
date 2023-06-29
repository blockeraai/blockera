/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
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

export default function RepeaterItemActions({
	item,
	itemId,
	isVisible,
	setVisibility,
}) {
	const {
		removeItem,
		changeItem,
		cloneItem,
		maxItems,
		minItems,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		repeaterItems,
	} = useContext(RepeaterContext);

	return (
		<>
			{actionButtonVisibility && (
				<Button
					className={controlInnerClassNames('btn-visibility')}
					noBorder={true}
					icon={isVisible ? EnableIcon : DisableIcon}
					showTooltip={true}
					onClick={(event) => {
						event.stopPropagation();
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
					aria-label={
						isVisible
							? sprintf(
									// translators: %d is the repeater item id. It's aria label for disabling repeater item
									__('Disable %d', 'publisher'),
									itemId + 1
							  )
							: sprintf(
									// translators: %d is the repeater item id. It's aria label for enabling repeater item
									__('Enable %d', 'publisher'),
									itemId + 1
							  )
					}
				/>
			)}

			{actionButtonClone &&
				(maxItems === -1 || repeaterItems?.length < maxItems) && (
					<Button
						className={controlInnerClassNames('btn-clone')}
						noBorder={true}
						icon={CloneIcon}
						showTooltip={true}
						label={__('Clone', 'publisher')}
						onClick={(event) => {
							event.stopPropagation();
							cloneItem(itemId);
						}}
						aria-label={sprintf(
							// translators: %d is the repeater item id. It's aria label for cloning repeater item
							__('Clone %d', 'publisher'),
							itemId + 1
						)}
					/>
				)}

			{actionButtonDelete &&
				(minItems === 0 || repeaterItems?.length > minItems) && (
					<Button
						className={controlInnerClassNames('btn-delete')}
						noBorder={true}
						icon={DeleteIcon}
						showTooltip={true}
						onClick={(event) => {
							event.stopPropagation();
							removeItem(itemId);
						}}
						label={__('Delete', 'publisher')}
						aria-label={sprintf(
							// translators: %d is the repeater item id. It's aria label for deleting repeater item
							__('Delete %d', 'publisher'),
							itemId + 1
						)}
					/>
				)}
		</>
	);
}
