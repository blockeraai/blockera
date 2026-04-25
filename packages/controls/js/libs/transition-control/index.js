// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { UpgradePrompt, Flex } from '../';
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
	withoutValueAddons = false,
	...props
}: TTransitionControlProps): MixedElement {
	return (
		<RepeaterControl
			className={controlClassNames('transition', className)}
			popoverTitle={popoverTitle || __('Transitions', 'blockera')}
			popoverClassName={componentInnerClassNames(
				'popover-transition-control'
			)}
			label={label || __('Transitions Timing', 'blockera')}
			labelDescription={labelDescription || <LabelDescription />}
			addNewButtonLabel={__('Add New Transition', 'blockera')}
			repeaterItemHeader={RepeaterItemHeader}
			repeaterItemChildren={Fields}
			defaultRepeaterItemValue={defaultRepeaterItemValue}
			id={'transition'}
			{...(!withoutValueAddons
				? {
						controlAddonTypes: ['variable'],
						variableTypes: ['transition'],
					}
				: {})}
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
					<UpgradePrompt
						lockedFeature={{
							icon: <Icon icon="layers" iconSize={26} />,
							title: __('Multiple Transition Layers', 'blockera'),
							description: (
								<Flex direction="column" gap="6px">
									{__(
										'Stack unlimited timing transition layers',
										'blockera'
									)}
									<Flex direction="row" gap="6px">
										<span className="blockera-free-plan-hint">
											{__('Free: 1 layer', 'blockera')}
										</span>
										<span className="blockera-pro-plan-hint">
											{__(
												'Pro: Unlimited layers',
												'blockera'
											)}
										</span>
									</Flex>
								</Flex>
							),
						}}
						isOpen={isOpen}
						onClose={onClose}
						type="modal"
					/>
				);
			}}
			{...props}
		/>
	);
}
