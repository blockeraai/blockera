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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import type { ConditionsExtensionProps } from './types/props';
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
					title={__('Conditions', 'blockera')}
					initialOpen={true}
					icon={<Icon icon="extension-conditions" />}
					className={extensionClassNames('conditions')}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'scrollAnimation'),
							value: {},
							attribute: 'blockeraConditions',
							blockName: block.blockName,
						}}
						storeName={'blockera/controls/repeater'}
					>
						<RepeaterControl
							label=""
							defaultValue={{}}
							design="large"
							icon={<Icon icon="condition" iconSize="26" />}
							description={__(
								'Set conditions for displaying the block on page.',
								'blockera'
							)}
							actionButtonAdd={false}
							injectHeaderButtonsStart={
								<span
									style={{
										color: 'var(--blockera-controls-primary-color)',
										fontStyle: 'italic',
									}}
								>
									{__('Coming soon…', 'blockera')}
								</span>
							}
						/>
					</ControlContextProvider>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
