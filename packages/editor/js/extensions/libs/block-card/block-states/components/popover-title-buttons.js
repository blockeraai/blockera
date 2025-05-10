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
import {
	Button,
	RepeaterContext,
	useControlContext,
	type RepeaterItemActionsProps,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

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
					icon={
						isVisible ? (
							<Icon icon="eye-show" iconSize="20" />
						) : (
							<Icon icon="eye-hide" iconSize="20" />
						)
					}
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
						icon={<Icon icon="clone" iconSize="20" />}
						showTooltip={true}
						label={__('Clone State', 'blockera')}
						onClick={(event) => {
							event.stopPropagation();

							cloneRepeaterItem({
								itemId,
								controlId,
								repeaterId,
								value: item,
								overrideItem,
							});
						}}
						tabIndex={-1}
					/>
				)}
		</>
	);
}
