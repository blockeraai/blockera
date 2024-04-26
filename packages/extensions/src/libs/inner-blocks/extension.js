// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlInnerClassNames,
	extensionClassNames,
} from '@blockera/classnames';
import { hasSameProps } from '@blockera/utils';
import { Button, MoreFeatures } from '@blockera/components';
import { BaseControl, PanelBodyControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { ArrowIcon } from './icons/arrow';
import { isInnerBlock } from '../../components';
import { InnerBlocksExtensionIcon } from './icons';
import type {
	InnerBlockModel,
	InnerBlockType,
	InnerBlocksProps,
} from './types';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({ innerBlocks }: InnerBlocksProps): MixedElement => {
		const { changeExtensionCurrentBlock: setCurrentBlock } =
			dispatch('blockera-core/extensions') || {};
		const { currentBlock = 'master' } = useSelect((select) => {
			const { getExtensionCurrentBlock } = select(
				'blockera-core/extensions'
			);

			return {
				currentBlock: getExtensionCurrentBlock(),
			};
		});

		if (!Object.values(innerBlocks).length || isInnerBlock(currentBlock)) {
			return <></>;
		}

		const forceInnerBlocks = [];

		const moreInnerBlocks = [];

		const moreInnerBlocksChanged = false; // todo implement detection for this

		Object.keys(innerBlocks).forEach(
			(innerBlockType: InnerBlockType | string) => {
				const innerBlock: InnerBlockModel = innerBlocks[innerBlockType];

				const { name, label, icon, innerBlockSettings } = innerBlock;

				const item = (
					<BaseControl
						label={label}
						controlName="icon"
						columns="1.2fr 2fr"
						key={`${name}-${innerBlockType}-${innerBlockType}`}
					>
						<Button
							size="input"
							contentAlign="left"
							onClick={() => setCurrentBlock(innerBlockType)}
							className={controlInnerClassNames(
								'inner-block__button',
								'extension-inner-blocks'
							)}
							aria-label={
								label + __(' Customize', 'blockera-core')
							}
						>
							{icon}

							{__('Customize', 'blockera-core')}

							<ArrowIcon />
						</Button>
					</BaseControl>
				);

				if (innerBlockSettings?.force) {
					forceInnerBlocks.push(item);
				} else {
					moreInnerBlocks.push(item);
				}
			}
		);

		return (
			<PanelBodyControl
				title={__('Inner Blocks', 'blockera-core')}
				initialOpen={false}
				icon={<InnerBlocksExtensionIcon />}
				className={extensionClassNames('inner-blocks')}
			>
				{forceInnerBlocks}

				{moreInnerBlocks.length > 0 && (
					<MoreFeatures
						label={__('More Inner Blocks', 'blockera-core')}
						ariaLabel={__('More Inner Blocks', 'blockera-core')}
						isOpen={false}
						isChanged={moreInnerBlocksChanged}
					>
						{moreInnerBlocks}
					</MoreFeatures>
				)}
			</PanelBodyControl>
		);
	},
	hasSameProps
);
