// @flow

/**
 * External dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { hasSameProps } from '@blockera/utils';
import {
	Button,
	BaseControl,
	MoreFeatures,
	PanelBodyControl,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../components';
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
							aria-label={label + __(' Customize', 'blockera')}
						>
							{icon}

							{__('Customize', 'blockera')}

							{isRTL() ? (
								<Icon icon="chevron-left" iconSize="20" />
							) : (
								<Icon icon="chevron-right" iconSize="20" />
							)}
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
				title={__('Inner Blocks', 'blockera')}
				initialOpen={false}
				icon={<Icon icon="extension-inner-blocks" />}
				className={extensionClassNames('inner-blocks')}
			>
				{forceInnerBlocks}

				{moreInnerBlocks.length > 0 && (
					<MoreFeatures
						label={__('More Inner Blocks', 'blockera')}
						ariaLabel={__('More Inner Blocks', 'blockera')}
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
