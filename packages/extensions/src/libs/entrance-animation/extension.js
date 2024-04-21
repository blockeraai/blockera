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
			if (!isActiveField(extensionConfig.blockeraEntranceAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('On Entrance', 'blockera-core')}
					initialOpen={true}
					icon={<EntranceAnimationExtensionIcon />}
					className={extensionClassNames('entrance-animation')}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(
								block,
								'entranceAnimation'
							),
							value: {},
							attribute: 'blockeraEntranceAnimation',
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
								'Block will animate when it enters into view.',
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
