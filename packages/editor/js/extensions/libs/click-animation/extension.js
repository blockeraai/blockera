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
					title={__('Animations', 'blockera')}
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
								// 'Clicking on the block will trigger the animation.',
								'Entrance, Scroll, Click, Hover, and more animations.',
								'blockera'
							)}
							actionButtonAdd={false}
							injectHeaderButtonsStart={
								<a
									href="https://community.blockera.ai/feature-request-1rsjg2ck/post/animation-for-blocks-S9na16eV4Z5IBU1/?utm_source=block-section-animations&utm_medium=referral&utm_campaign=coming-soon-feature&utm_content=cta-link"
									target="_blank"
									style={{
										color: 'var(--blockera-controls-primary-color)',
										fontStyle: 'italic',
									}}
									rel="noreferrer"
								>
									{__('Coming soon…', 'blockera')}
								</a>
							}
						/>
					</ControlContextProvider>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
