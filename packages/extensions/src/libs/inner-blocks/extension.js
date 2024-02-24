// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import { Button, MoreFeatures } from '@publisher/components';
import {
	controlInnerClassNames,
	extensionClassNames,
} from '@publisher/classnames';
import { BaseControl, PanelBodyControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { hasSameProps } from '@publisher/utils';
import { ArrowIcon } from './icons/arrow';
import { useBlockContext } from '../../hooks';
import { isInnerBlock } from '../../components';
import { InnerBlocksExtensionIcon } from './icons';
import type {
	InnerBlockModel,
	InnerBlockType,
	InnerBlocksProps,
} from './types';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({ innerBlocks }: InnerBlocksProps): MixedElement => {
		const { updateBlockEditorSettings } = useBlockContext();

		const { currentBlock = 'master' } = useSelect((select) => {
			const { getExtensionCurrentBlock } = select(
				'publisher-core/extensions'
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
						columns="columns-2"
						key={`${name}-${innerBlockType}-${innerBlockType}`}
					>
						<Button
							size="input"
							contentAlign="left"
							onClick={() =>
								updateBlockEditorSettings(
									'current-block',
									innerBlockType
								)
							}
							className={controlInnerClassNames(
								'inner-block__button',
								'extension-inner-blocks'
							)}
						>
							{icon}

							{__('Customize', 'publisher-core')}

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
			<>
				<PanelBodyControl
					title={__('Inner Blocks', 'publisher-core')}
					initialOpen={false}
					icon={<InnerBlocksExtensionIcon />}
					className={extensionClassNames('inner-blocks')}
				>
					{forceInnerBlocks}

					{moreInnerBlocks.length && (
						<MoreFeatures
							label={__('More Inner Blocks', 'publisher-core')}
							isOpen={false}
							isChanged={moreInnerBlocksChanged}
						>
							{moreInnerBlocks}
						</MoreFeatures>
					)}
				</PanelBodyControl>
			</>
		);
	},
	hasSameProps
);
