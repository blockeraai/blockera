// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import type { ComponentType, MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';
import { FeatureWrapper } from '@publisher/components';
import { useSelect } from '@wordpress/data';
import { PanelBodyControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { hasSameProps } from '../utils';
import type { StyleVariationsExtensionProps } from './types';
import BlockStyles from './components/block-styles';
import { useStylesForBlocks } from './utils';
import { default as StyleVariationsExtensionIcon } from './icons/extension-icon';
import { isInnerBlock } from '../../components';

export const StyleVariationsExtension: ComponentType<StyleVariationsExtensionProps> =
	memo(
		({
			block,
			extensionConfig,
		}: StyleVariationsExtensionProps): MixedElement => {
			const { currentBlock = 'master' } = useSelect((select) => {
				const { getExtensionCurrentBlock } = select(
					'publisher-core/extensions'
				);

				return {
					currentBlock: getExtensionCurrentBlock(),
				};
			});

			const {
				onSelect,
				stylesToRender,
				activeStyle,
				genericPreviewBlock,
				className: previewClassName,
			} = useStylesForBlocks({
				clientId: block.clientId,
				onSwitch: () => {},
			});

			if (
				!stylesToRender ||
				stylesToRender.length === 0 ||
				isInnerBlock(currentBlock)
			) {
				return <></>;
			}

			const isActiveStyleVariation = isActiveField(
				extensionConfig.publisherStyleVariation
			);

			if (!isActiveStyleVariation) {
				return <></>;
			}

			return (
				<PanelBodyControl
					title={__('Style Variations', 'publisher-core')}
					initialOpen={true}
					icon={<StyleVariationsExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-style-variations'
					)}
				>
					<FeatureWrapper
						isActive={isActiveStyleVariation}
						isActiveOnStates={
							extensionConfig.publisherStyleVariation
								.isActiveOnStates
						}
						isActiveOnBreakpoints={
							extensionConfig.publisherStyleVariation
								.isActiveOnBreakpoints
						}
					>
						<BlockStyles
							styles={{
								onSelect,
								stylesToRender,
								activeStyle,
								genericPreviewBlock,
								previewClassName,
							}}
						/>
					</FeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
