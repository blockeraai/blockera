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
import type { ClickAnimationExtensionProps } from './types/props';
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
					icon={<Icon icon="extension-click-animation" />}
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
							icon={<Icon icon="click-animation" iconSize="26" />}
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
