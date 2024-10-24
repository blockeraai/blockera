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
import { isActiveField } from '../../api/utils';
import { useBlockSection } from '../../components';
import type { ClickAnimationExtensionProps } from './types/props';

export const ClickAnimationExtension: ComponentType<ClickAnimationExtensionProps> =
	memo(
		({
			values: {},
			block,
			extensionConfig,
		}: ClickAnimationExtensionProps): MixedElement => {
			const { initialOpen, onToggle } = useBlockSection(
				'clickAnimationConfig'
			);
			if (!isActiveField(extensionConfig.blockeraClickAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					onToggle={onToggle}
					title={__('On Click', 'blockera')}
					initialOpen={initialOpen}
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
						storeName={'blockera/controls/repeater'}
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
