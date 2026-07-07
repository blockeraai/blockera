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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { UpgradePrompt, Flex } from '../';
import Fields from './components/fields';
import RepeaterControl from '../repeater-control';
import type { BoxShadowControlProps } from './types';
import RepeaterItemHeader from './components/header';
import { getRepeaterActiveItemsCount } from '../repeater-control/helpers';

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
	withoutValueAddons = false,
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
			{...(!withoutValueAddons
				? { controlAddonTypes: ['variable'], variableTypes: ['shadow'] }
				: {})}
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
							title: __('Multiple Box Shadows', 'blockera'),
							description: (
								<Flex direction="column" gap="6px">
									{__(
										'Stack unlimited box shadow layers',
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
						type="modal"
						isOpen={isOpen}
						onClose={onClose}
					/>
				);
			}}
			{...props}
		/>
	);
}
