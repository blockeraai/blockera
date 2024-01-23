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
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { generateExtensionId, hasSameProps } from '../utils';
import type { EntranceExtensionProps } from './types/props';
import { EntranceAnimationExtensionIcon } from './index';
import AnimationIcon from './icons/animation-icon';
import { isActiveField } from '../../api/utils';

export const EntranceAnimationExtension: ComponentType<EntranceExtensionProps> =
	memo(
		({
			values: {},
			block,
			extensionConfig,
		}: EntranceExtensionProps): MixedElement => {
			if (!isActiveField(extensionConfig.publisherEntranceAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('On Entrance', 'publisher-core')}
					initialOpen={true}
					icon={<EntranceAnimationExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-entrance-animation'
					)}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'entranceAnimation'
							),
							value: {},
							attribute: 'publisherEntranceAnimation',
							blockName: block.blockName,
						}}
						storeName={'publisher-core/controls/repeater'}
					>
						<RepeaterControl
							label=""
							defaultValue={{}}
							design="large"
							icon={<AnimationIcon />}
							description={__(
								'Block will animate when it enters into view.',
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
