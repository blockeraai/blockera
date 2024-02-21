// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import {
	ControlContextProvider,
	PanelBodyControl,
	RepeaterControl,
} from '@publisher/controls';
import { hasSameProps } from '@publisher/utils';
import { componentClassNames } from '@publisher/classnames';

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
			if (!isActiveField(extensionConfig.publisherConditions)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('Conditions', 'publisher-core')}
					initialOpen={true}
					icon={<ConditionsExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-conditions'
					)}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'scrollAnimation'),
							value: {},
							attribute: 'publisherConditions',
							blockName: block.blockName,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<RepeaterControl
							label=""
							defaultValue={{}}
							design="large"
							icon={<ConditionIcon />}
							description={__(
								'Set conditions for displaying the block on page.',
								'publisher-core'
							)}
							actionButtonAdd={false}
							injectHeaderButtonsStart={
								<span
									style={{
										color: 'var(--publisher-controls-primary-color)',
										fontStyle: 'italic',
									}}
								>
									{__('Coming soon…', 'publisher-core')}
								</span>
							}
						/>
					</ControlContextProvider>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
