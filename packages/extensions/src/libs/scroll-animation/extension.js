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
			if (!isActiveField(extensionConfig.blockeraScrollAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('On Scroll', 'blockera-core')}
					initialOpen={true}
					icon={<ScrollAnimationExtensionIcon />}
					className={extensionClassNames('scroll-animation')}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'scrollAnimation'),
							value: {},
							attribute: 'blockeraScrollAnimation',
							blockName: block.blockName,
						}}
						storeName={'blockera-core/controls/repeater'}
					>
						<RepeaterControl
							label=""
							defaultValue={{}}
							design="large"
							icon={<AnimationIcon />}
							description={__(
								'Scrolling will trigger the animation.',
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
