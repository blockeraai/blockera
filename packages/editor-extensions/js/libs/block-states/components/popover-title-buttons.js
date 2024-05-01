// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { RepeaterContext } from '@blockera/controls/js/libs/repeater-control/context';
import { useControlContext } from '@blockera/controls';
import { Button } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';
import EnableIcon from '@blockera/controls/js/libs/repeater-control/icons/enable';
import DisableIcon from '@blockera/controls/js/libs/repeater-control/icons/disable';
import CloneIcon from '@blockera/controls/js/libs/repeater-control/icons/clone';
import type { RepeaterItemActionsProps } from '@blockera/controls/js/libs/repeater-control/types';

export function PopoverTitleButtons({
	item,
	itemId,
	isVisible,
	setVisibility,
}: RepeaterItemActionsProps): MixedElement {
	const { controlId, maxItems, repeaterId, overrideItem, repeaterItems } =
		useContext(RepeaterContext);

	const {
		dispatch: { changeRepeaterItem, cloneRepeaterItem },
	} = useControlContext();

	return (
		<>
			{item?.visibilitySupport && (
				<Button
					className={controlInnerClassNames('btn-visibility')}
					icon={isVisible ? EnableIcon : DisableIcon}
					showTooltip={true}
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
							? __('Disable State', 'blockera')
							: __('Enable State', 'blockera')
					}
					tabIndex={-1}
				/>
			)}

			{item?.cloneable &&
				(maxItems === -1 || repeaterItems?.length < maxItems) && (
					<Button
						className={controlInnerClassNames('btn-clone')}
						icon={CloneIcon}
						showTooltip={true}
						label={__('Clone State', 'blockera')}
						onClick={(event) => {
							event.stopPropagation();

							cloneRepeaterItem({
								item,
								itemId,
								controlId,
								repeaterId,
								overrideItem,
							});
						}}
						tabIndex={-1}
					/>
				)}
		</>
	);
}
