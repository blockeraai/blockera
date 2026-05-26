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
import type { ScrollExtensionProps } from './types/props';

export const ScrollAnimationExtension: ComponentType<ScrollExtensionProps> =
	memo(
		({
			values: {},
			block,
			extensionConfig,
		}: ScrollExtensionProps): MixedElement => {
			const { initialOpen, onToggle } = useBlockSection(
				'scrollAnimationConfig'
			);

			if (!isActiveField(extensionConfig.blockeraScrollAnimation)) {
				return <></>;
			}

			return (
				<PanelBodyControl
					onToggle={onToggle}
					title={__('On Scroll', 'blockera')}
					initialOpen={initialOpen}
					icon={<Icon icon="extension-scroll-animation" />}
					className={extensionClassNames('scroll-animation')}
				>
					<ControlContextProvider
						value={{
							name: generateExtensionId(block, 'scrollAnimation'),
							value: {},
							attribute: 'blockeraScrollAnimation',
							blockName: block.blockName,
						}}
						storeName={'blockera/controls/repeater'}
					>
						<RepeaterControl
							label=""
							defaultValue={{}}
							design="large"
							icon={<Icon icon="scroll-animation" />}
							description={__(
								'Scrolling will trigger the animation.',
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
