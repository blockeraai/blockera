// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import { PromotionPopover } from '@blockera/components';

/**
 * Internal dependencies
 */
import RepeaterItemHeader from './components/header';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';
import type { BoxShadowControlProps } from './types';
import { getRepeaterActiveItemsCount } from '../repeater-control/utils';

export default function BoxShadowControl({
	id = 'box-shadow',
	popoverTitle = __('Box Shadow', 'blockera'),
	className,
	defaultValue = [],
	defaultRepeaterItemValue = {
		type: 'outer',
		x: '10px',
		y: '10px',
		blur: '10px',
		spread: '0px',
		color: '#000000ab',
		isVisible: true,
	},
	...props
}: BoxShadowControlProps): MixedElement {
	return (
		<RepeaterControl
			id={id}
			className={controlClassNames('box-shadow', className)}
			popoverTitle={popoverTitle}
			addNewButtonLabel={__('Add New Box Shadow', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			defaultValue={defaultValue}
			PromoComponent={({
				items,
				onClose = () => {},
				isOpen = false,
			}): MixedElement | null => {
				if (getRepeaterActiveItemsCount(items) < 1) {
					return null;
				}

				return (
					<PromotionPopover
						heading={__('Multiple Box Shadows', 'blockera')}
						featuresList={[
							__('Multiple box shadows', 'blockera'),
							__('Advanced box shadow effects', 'blockera'),
							__('Advanced features', 'blockera'),
							__('Premium blocks', 'blockera'),
						]}
						isOpen={isOpen}
						onClose={onClose}
					/>
				);
			}}
			{...props}
		/>
	);
}
