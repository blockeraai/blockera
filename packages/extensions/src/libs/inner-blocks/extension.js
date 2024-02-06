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
import { componentClassNames } from '@publisher/classnames';
import { BaseControl, PanelBodyControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { hasSameProps } from '../utils';
import { useBlockContext } from '../../hooks';
import { isInnerBlock } from '../../components';
import { InnerBlocksExtensionIcon } from './icons';
import type { InnerBlockModel, InnerBlocksProps } from './types';
import { ArrowIcon } from './icons/arrow';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({ innerBlocks }: InnerBlocksProps): MixedElement => {
		const { handleOnSwitchBlockSettings: switchBlockSettings } =
			useBlockContext();

		const { currentBlock = 'master' } = useSelect((select) => {
			const { getExtensionCurrentBlock } = select(
				'publisher-core/extensions'
			);

			return {
				currentBlock: getExtensionCurrentBlock(),
			};
		});

		const MappedInnerBlocks = () =>
			innerBlocks.map(
				(
					{ name, label, type, icon }: InnerBlockModel,
					index: number
				) => {
					return (
						<BaseControl
							label={label}
							controlName="icon"
							columns="columns-2"
							key={`${name}-${type}-${index}`}
						>
							<Button
								size="input"
								contentAlign="left"
								onClick={() => switchBlockSettings(type)}
							>
								{icon}

								{__('Customize', 'publisher-core')}

								<ArrowIcon />
							</Button>
						</BaseControl>
					);
				}
			);

		if (!innerBlocks.length || isInnerBlock(currentBlock)) {
			return <></>;
		}

		return (
			<>
				<PanelBodyControl
					title={__('Inner Blocks', 'publisher-core')}
					initialOpen={false}
					icon={<InnerBlocksExtensionIcon />}
					className={componentClassNames(
						'extension',
						'extension-inner-blocks'
					)}
				>
					<MappedInnerBlocks />
				</PanelBodyControl>
			</>
		);
	},
	hasSameProps
);
