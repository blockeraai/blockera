// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
import { Button, Icon } from '@publisher/components';
import { componentClassNames } from '@publisher/classnames';
import { BaseControl, PanelBodyControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { hasSameProps } from '../utils';
import { useBlockContext } from '../../hooks';
import { InnerBlocksExtensionIcon } from './icons';
import type { InnerBlockModel, InnerBlocksProps } from './types';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({ innerBlocks, setParentIsLoad }: InnerBlocksProps): MixedElement => {
		const { handleOnSwitchBlockSettings: switchBlockSettings } =
			useBlockContext();

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
								onClick={() => {
									setParentIsLoad(false);
									switchBlockSettings(type);
								}}
							>
								{icon && (
									<Icon icon={icon.name} library={icon.lib} />
								)}
								{__('Customize', 'publisher-core')}
								<Icon icon={'arrowRight'} library={'wp'} />
							</Button>
						</BaseControl>
					);
				}
			);

		if (!innerBlocks.length) {
			return <></>;
		}

		return (
			<>
				<PanelBodyControl
					title={__('Inner Blocks', 'publisher-core')}
					initialOpen={true}
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
