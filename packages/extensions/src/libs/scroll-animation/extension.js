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
import type { ScrollExtensionProps } from './types/props';
import { ScrollAnimationExtensionIcon } from './index';
import AnimationIcon from './icons/animation-icon';
import { isActiveField } from '../../api/utils';

export const ScrollAnimationExtension: ComponentType<ScrollExtensionProps> =
	memo(
		({
			values: {},
			block,
			extensionConfig,
		}: ScrollExtensionProps): MixedElement => {
			if (!isActiveField(extensionConfig.publisherScrollAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('On Scroll', 'publisher-core')}
					initialOpen={true}
					icon={<ScrollAnimationExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-scroll-animation'
					)}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'scrollAnimation'),
							value: {},
							attribute: 'publisherScrollAnimation',
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
								'Scrolling will trigger the animation.',
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
