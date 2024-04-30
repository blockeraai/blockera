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
			if (!isActiveField(extensionConfig.blockeraClickAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('On Click', 'blockera')}
					initialOpen={true}
					icon={<ClickAnimationExtensionIcon />}
					className={extensionClassNames('click-animation')}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'clickAnimation'),
							value: {},
							attribute: 'blockeraClickAnimation',
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
								'Clicking on the block will trigger the animation.',
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
