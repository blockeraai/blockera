// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../context';
import DeleteIcon from '../icons/delete';
import EnableIcon from '../icons/enable';
import DisableIcon from '../icons/disable';
import CloneIcon from '../icons/clone';
import { useControlContext } from '../../../context';
import type { RepeaterItemActionsProps } from '../types';

export default function RepeaterItemActions({
	item,
	itemId,
	isVisible,
	setVisibility,
}: RepeaterItemActionsProps): MixedElement {
	const {
		controlId,
		maxItems,
		minItems,
		onDelete,
		repeaterId,
		overrideItem,
		itemIdGenerator,
		isItemDeletable,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		repeaterItems,
	} = useContext(RepeaterContext);

	const itemsCount = Object.keys(repeaterItems).length;

	const {
		dispatch: {
			changeRepeaterItem,
			cloneRepeaterItem,
			removeRepeaterItem,
			modifyControlValue,
		},
	} = useControlContext();

	return (
		<>
			{actionButtonVisibility && item?.visibilitySupport && (
				<Button
					className={controlInnerClassNames('btn-visibility')}
					noBorder={true}
					icon={isVisible ? EnableIcon : DisableIcon}
					showTooltip={true}
					tooltipPosition="top"
					onClick={(event) => {
						event.stopPropagation();
						setVisibility(!isVisible);
						const value = item?.selectable
							? {
									...item,
									isVisible: !isVisible,
									isSelected: false,
							  }
							: {
									...item,
									isVisible: !isVisible,
							  };

						changeRepeaterItem({
							controlId,
							itemId,
							value,
							repeaterId,
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
				item?.cloneable &&
				(maxItems === -1 || itemsCount < maxItems) && (
					<Button
						className={controlInnerClassNames('btn-clone')}
						noBorder={true}
						icon={CloneIcon}
						showTooltip={true}
						tooltipPosition="top"
						label={__('Clone', 'publisher')}
						onClick={(event) => {
							event.stopPropagation();

							cloneRepeaterItem({
								item,
								itemId,
								controlId,
								repeaterId,
								overrideItem,
								itemIdGenerator,
							});
						}}
						aria-label={sprintf(
							// translators: %d is the repeater item id. It's aria label for cloning repeater item
							__('Clone %d', 'publisher'),
							itemId + 1
						)}
					/>
				)}

			{actionButtonDelete &&
				item?.deletable &&
				(minItems === 0 || itemsCount > minItems) && (
					<Button
						className={controlInnerClassNames('btn-delete')}
						noBorder={true}
						icon={DeleteIcon}
						showTooltip={true}
						tooltipPosition="top"
						onClick={(event) => {
							event.stopPropagation();

							if (
								'function' === typeof isItemDeletable &&
								!isItemDeletable(itemId)
							) {
								return;
							}

							if (
								!item.selectable ||
								'function' !== typeof onDelete
							) {
								removeRepeaterItem({
									itemId,
									controlId,
									repeaterId,
								});

								return;
							}

							modifyControlValue({
								controlId,
								value: onDelete(itemId, repeaterItems),
							});
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
