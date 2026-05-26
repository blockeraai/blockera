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

/**
 * Internal dependencies
 */
import { PromotionPopover } from '../';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';
import RepeaterItemHeader from './components/header';
import type { TTransitionControlProps } from './types';
import { LabelDescription } from './components/label-description';
import { getRepeaterActiveItemsCount } from '../repeater-control/helpers';
import { getTransitionTypeOptions, getTransitionTimingOptions } from './utils';

export default function TransitionControl({
	defaultRepeaterItemValue = {
		type: 'all',
		duration: '500ms',
		timing: 'ease',
		delay: '0ms',
		isVisible: true,
	},
	popoverTitle,
	label,
	labelDescription,
	className,
	...props
}: TTransitionControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('transition', className)}
			popoverTitle={popoverTitle || __('Transitions', 'blockera')}
			label={label || __('Transitions', 'blockera')}
			labelDescription={labelDescription || <LabelDescription />}
			addNewButtonLabel={__('Add New Transition', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			id={'transition'}
			getTransitionTypeOptions={getTransitionTypeOptions}
			getTransitionTimingOptions={getTransitionTimingOptions}
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
						heading={__('Multiple Transitions', 'blockera')}
						featuresList={[
							__('Multiple transitions', 'blockera'),
							__('Advanced transition effects', 'blockera'),
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
