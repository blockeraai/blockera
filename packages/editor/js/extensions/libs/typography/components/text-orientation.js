// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	ControlContextProvider,
	Flex,
	ToggleSelectControl,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

function getBlockeraTextOrientationSelectOptions(iconSize: number = 16): any {
	return [
		{
			label: __('Vertical LR Mixed', 'blockera'),
			value: 'style-1',
			icon: <Icon icon="text-orientation-style-1" iconSize={iconSize} />,
		},
		{
			label: __('Vertical RL Mixed', 'blockera'),
			value: 'style-2',
			icon: <Icon icon="text-orientation-style-2" iconSize={iconSize} />,
		},
		{
			label: __('Vertical LR Upright', 'blockera'),
			value: 'style-3',
			icon: <Icon icon="text-orientation-style-3" iconSize={iconSize} />,
		},
		{
			label: __('Vertical RL Upright', 'blockera'),
			value: 'style-4',
			icon: <Icon icon="text-orientation-style-4" iconSize={iconSize} />,
		},
		{
			label: __('No text orientation', 'blockera'),
			value: 'initial',
			icon: <Icon library="wp" icon="close-small" iconSize={iconSize} />,
		},
	];
}

export const TextOrientation = ({
	block,
	value,
	onChange,
	defaultValue,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
	labelProps?: Object,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'text-orientation'),
				value,
				attribute: 'blockeraTextOrientation',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Orientation', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the orientation of characters in vertical text layouts, pivotal for typesetting in languages that use vertical writing modes.',
								'blockera'
							)}
						</p>
						<Flex gap="10px" direction="column">
							<h3
								style={{
									paddingTop: '5px',
								}}
							>
								<Icon
									icon="text-orientation-style-1"
									iconSize="18"
								/>
								{__('Vertical LR Mixed', 'blockera')}
							</h3>
							<p>
								{__(
									'Text will display vertically from left to right with a mixed orientation.',
									'blockera'
								)}
							</p>
						</Flex>

						<Flex gap="10px" direction="column">
							<h3
								style={{
									paddingTop: '5px',
								}}
							>
								<Icon
									icon="text-orientation-style-2"
									iconSize="18"
								/>
								{__('Vertical RL Mixed', 'blockera')}
							</h3>
							<p>
								{__(
									'Text will display vertically from right to left with a mixed orientation.',
									'blockera'
								)}
							</p>
						</Flex>

						<Flex gap="10px" direction="column">
							<h3
								style={{
									paddingTop: '5px',
								}}
							>
								<Icon
									icon="text-orientation-style-3"
									iconSize="18"
								/>
								{__('Vertical LR Upright', 'blockera')}
							</h3>
							<p>
								{__(
									'Text will appear vertically from left to right with an upright orientation.',
									'blockera'
								)}
							</p>
						</Flex>

						<Flex gap="10px" direction="column">
							<h3
								style={{
									paddingTop: '5px',
								}}
							>
								<Icon
									icon="text-orientation-style-4"
									iconSize="18"
								/>
								{__('Vertical RL Upright', 'blockera')}
							</h3>
							<p>
								{__(
									'Text will appear vertically from right to left with an upright orientation.',
									'blockera'
								)}
							</p>
						</Flex>

						<Flex gap="10px" direction="column">
							<h3
								style={{
									paddingTop: '2px',
								}}
							>
								<Icon
									library="wp"
									icon="close-small"
									iconSize="18"
								/>
								{__('No text orientation', 'blockera')}
							</h3>
							<p>{__('No text orientation', 'blockera')}</p>
						</Flex>
					</>
				}
				columns="1fr 2.5fr"
				options={getBlockeraTextOrientationSelectOptions()}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraTextOrientation', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraTextOrientationSelectOptions(
									iconSize
								),
							showIcon: true,
							showLabel: false,
							iconSize: 16,
							emptyValueMeansNoPreview: true,
						}),
				}}
			/>
		</ControlContextProvider>
	);
};
