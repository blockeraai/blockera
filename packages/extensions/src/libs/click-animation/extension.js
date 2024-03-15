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
import { extensionClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import type { ClickAnimationExtensionProps } from './types/props';
import { ClickAnimationExtensionIcon } from './index';
import AnimationIcon from './icons/animation-icon';
import { isActiveField } from '../../api/utils';

export const ClickAnimationExtension: ComponentType<ClickAnimationExtensionProps> =
	memo(
		({
			values: {},
			block,
			extensionConfig,
		}: ClickAnimationExtensionProps): MixedElement => {
			if (!isActiveField(extensionConfig.publisherClickAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('On Click', 'publisher-core')}
					initialOpen={true}
					icon={<ClickAnimationExtensionIcon />}
					className={extensionClassNames('click-animation')}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'clickAnimation'),
							value: {},
							attribute: 'publisherClickAnimation',
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
								'Clicking on the block will trigger the animation.',
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
