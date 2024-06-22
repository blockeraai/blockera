// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button } from '../../';
import { RepeaterContext } from '../context';
import { getArialLabelSuffix, isEnabledPromote } from '../utils';
import { useControlContext } from '../../../context';
import type { RepeaterItemActionsProps } from '../types';
import { repeaterOnChange } from '../store/reducers/utils';

export default function RepeaterItemActions({
	item,
	itemId,
	isVisible,
	setVisibility,
}: RepeaterItemActionsProps): MixedElement {
	const {
		count,
		setCount,
		PromoComponent,
		setDisableAddNewItem,
		controlId,
		maxItems,
		minItems,
		onDelete,
		onChange,
		valueCleanup,
		repeaterId,
		overrideItem,
		itemIdGenerator,
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
					icon={
						isVisible ? (
							<Icon icon="eye-show" iconSize="20" />
						) : (
							<Icon icon="eye-hide" iconSize="20" />
						)
					}
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
							onChange,
							valueCleanup,
						});
					}}
					label={
						isVisible
							? __('Disable', 'blockera')
							: __('Enable', 'blockera')
					}
					aria-label={
						isVisible
							? sprintf(
									// translators: %s is the repeater item id. It's aria label for disabling repeater item
									__('Disable %s', 'blockera'),
									getArialLabelSuffix(itemId)
							  )
							: sprintf(
									// translators: %s is the repeater item id. It's aria label for enabling repeater item
									__('Enable %s', 'blockera'),
									getArialLabelSuffix(itemId)
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
						icon={<Icon icon="clone" size="20" />}
						showTooltip={true}
						tooltipPosition="top"
						label={__('Clone', 'blockera')}
						onClick={(event) => {
							event.stopPropagation();

							if (
								isEnabledPromote(PromoComponent, repeaterItems)
							) {
								setCount(count + 1);
								setDisableAddNewItem(true);

								return;
							}

							cloneRepeaterItem({
								item,
								itemId,
								onChange,
								controlId,
								repeaterId,
								overrideItem,
								valueCleanup,
								itemIdGenerator,
							});
						}}
						aria-label={sprintf(
							// translators: %s is the repeater item id. It's aria label for cloning repeater item
							__('Clone %s', 'blockera'),
							getArialLabelSuffix(itemId)
						)}
					/>
				)}

			{actionButtonDelete &&
				item?.deletable &&
				(minItems === 0 || itemsCount > minItems) && (
					<Button
						className={controlInnerClassNames('btn-delete')}
						noBorder={true}
						icon={<Icon icon="trash" size="20" />}
						showTooltip={true}
						tooltipPosition="top"
						onClick={(event) => {
							event.stopPropagation();

							if (
								!item.selectable ||
								'function' !== typeof onDelete
							) {
								removeRepeaterItem({
									itemId,
									onChange,
									controlId,
									repeaterId,
									valueCleanup,
									itemIdGenerator,
								});

								return;
							}

							const value = onDelete(itemId, repeaterItems);

							modifyControlValue({
								controlId,
								value,
							});

							repeaterOnChange(value, {
								onChange,
								valueCleanup,
							});
						}}
						label={__('Delete', 'blockera')}
						aria-label={sprintf(
							// translators: %s is the repeater item id. It's aria label for deleting repeater item
							__('Delete %s', 'blockera'),
							getArialLabelSuffix(itemId)
						)}
					/>
				)}
		</>
	);
}
