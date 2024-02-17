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
import { Button } from '@publisher/components';
import {
	controlInnerClassNames,
	extensionClassNames,
} from '@publisher/classnames';
import { BaseControl, PanelBodyControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { hasSameProps } from '../utils';
import { ArrowIcon } from './icons/arrow';
import { useBlockContext } from '../../hooks';
import { isInnerBlock } from '../../components';
import { InnerBlocksExtensionIcon } from './icons';
import type { InnerBlockType, InnerBlocksProps } from './types';

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

		const MappedInnerBlocks = () =>
			Object.keys(innerBlocks).map(
				(innerBlockType: InnerBlockType | string, index: number) => {
					const { name, label, icon } = innerBlocks[innerBlockType];

					return (
						<BaseControl
							label={label}
							controlName="icon"
							columns="columns-2"
							key={`${name}-${innerBlockType}-${index}`}
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
					<MappedInnerBlocks />
				</PanelBodyControl>
			</>
		);
	},
	hasSameProps
);
