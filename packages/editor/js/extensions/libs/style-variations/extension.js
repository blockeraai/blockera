// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import type { ComponentType, MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { hasSameProps } from '@blockera/utils';
import { PanelBodyControl } from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { useStylesForBlocks } from './utils';
import { isActiveField } from '../../api/utils';
import { EditorFeatureWrapper } from '../../../';
import BlockStyles from './components/block-styles';
import type { StyleVariationsExtensionProps } from './types';
import { isInnerBlock, useBlockSection } from '../../components';

export const StyleVariationsExtension: ComponentType<StyleVariationsExtensionProps> =
	memo(
		({
			block,
			extensionConfig,
		}: StyleVariationsExtensionProps): MixedElement => {
			const { initialOpen, onToggle } = useBlockSection(
				'styleVariationsConfig'
			);
			const { currentBlock = 'master' } = useSelect((select) => {
				const { getExtensionCurrentBlock } = select(
					'blockera/extensions'
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
				extensionConfig.blockeraStyleVariation
			);

			if (!isActiveStyleVariation) {
				return <></>;
			}

			return (
				<PanelBodyControl
					onToggle={onToggle}
					title={__('Style Variations', 'blockera')}
					initialOpen={initialOpen}
					icon={<Icon icon="extension-style-variations" />}
					className={extensionClassNames('style-variations')}
				>
					<EditorFeatureWrapper
						isActive={isActiveStyleVariation}
						config={extensionConfig.blockeraStyleVariation}
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
					</EditorFeatureWrapper>
				</PanelBodyControl>
			);
		},
		hasSameProps
	);
