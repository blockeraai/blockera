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
import DeleteIcon from '../icons/delete';
import EnableIcon from '../icons/enable';
import DisableIcon from '../icons/disable';
import CloneIcon from '../icons/clone';
import { useControlContext } from '../../../context';

export default function RepeaterItemActions({
	item,
	itemId,
	isVisible,
	setVisibility,
}) {
	const {
		controlId,
		maxItems,
		minItems,
		repeaterId,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		repeaterItems,
	} = useContext(RepeaterContext);
	const {
		dispatch: { changeRepeaterItem, cloneRepeaterItem, removeRepeaterItem },
	} = useControlContext();

	return (
		<>
			{actionButtonVisibility && (
				<Button
					className={controlInnerClassNames('btn-visibility')}
					noBorder={true}
					icon={isVisible ? EnableIcon : DisableIcon}
					showTooltip={true}
					tooltipPosition="top"
					onClick={(event) => {
						event.stopPropagation();
						setVisibility(!isVisible);
						changeRepeaterItem({
							controlId,
							itemId,
							value: {
								...item,
								isVisible: !isVisible,
							},
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
				(maxItems === -1 || repeaterItems?.length < maxItems) && (
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
								itemId,
								controlId,
								repeaterId,
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
				(minItems === 0 || repeaterItems?.length > minItems) && (
					<Button
						className={controlInnerClassNames('btn-delete')}
						noBorder={true}
						icon={DeleteIcon}
						showTooltip={true}
						tooltipPosition="top"
						onClick={(event) => {
							event.stopPropagation();
							removeRepeaterItem({
								itemId,
								controlId,
								repeaterId,
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
