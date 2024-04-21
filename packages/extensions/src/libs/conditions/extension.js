// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	ControlContextProvider,
	PanelBodyControl,
	RepeaterControl,
} from '@blockera/controls';
import { hasSameProps } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import type { ConditionsExtensionProps } from './types/props';
import { ConditionsExtensionIcon } from './index';
import ConditionIcon from './icons/condition-icon';
import { isActiveField } from '../../api/utils';

export const ConditionsExtension: ComponentType<ConditionsExtensionProps> =
	memo(
		({
			values: {},
			block,
			extensionConfig,
		}: ConditionsExtensionProps): MixedElement => {
			if (!isActiveField(extensionConfig.blockeraConditions)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('Conditions', 'blockera-core')}
					initialOpen={true}
					icon={<ConditionsExtensionIcon />}
					className={extensionClassNames('conditions')}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'scrollAnimation'),
							value: {},
							attribute: 'blockeraConditions',
							blockName: block.blockName,
						}}
						storeName={'blockera-core/controls/repeater'}
					>
						<RepeaterControl
							label=""
							defaultValue={{}}
							design="large"
							icon={<ConditionIcon />}
							description={__(
								'Set conditions for displaying the block on page.',
								'blockera-core'
							)}
							actionButtonAdd={false}
							injectHeaderButtonsStart={
								<span
									style={{
										color: 'var(--blockera-controls-primary-color)',
										fontStyle: 'italic',
									}}
								>
									{__('Coming soon…', 'blockera-core')}
								</span>
							}
						/>
					</ControlContextProvider>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
