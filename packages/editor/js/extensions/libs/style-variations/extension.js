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
import { extensionClassNames } from '@blockera/classnames';
import { PanelBodyControl } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../api/utils';
import { hasSameProps } from '@blockera/utils';
import { EditorFeatureWrapper } from '../../../';
import type { StyleVariationsExtensionProps } from './types';
import BlockStyles from './components/block-styles';
import { useStylesForBlocks } from './utils';
import { isInnerBlock } from '../../components';

export const StyleVariationsExtension: ComponentType<StyleVariationsExtensionProps> =
	memo(
		({
			block,
			extensionConfig,
		}: StyleVariationsExtensionProps): MixedElement => {
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
					title={__('Style Variations', 'blockera')}
					initialOpen={true}
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
