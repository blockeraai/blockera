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
	ToggleSelectControl,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

function getBlockeraTextAlignSelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Left', 'blockera'),
			value: 'left',
			icon: <Icon icon="text-align-left" iconSize={iconSize} />,
		},
		{
			label: __('Center', 'blockera'),
			value: 'center',
			icon: <Icon icon="text-align-center" iconSize={iconSize} />,
		},
		{
			label: __('Right', 'blockera'),
			value: 'right',
			icon: <Icon icon="text-align-right" iconSize={iconSize} />,
		},
		{
			label: __('Justify', 'blockera'),
			value: 'justify',
			icon: <Icon icon="text-align-justify" iconSize={iconSize} />,
		},
		{
			label: __('None', 'blockera'),
			value: 'initial',
			icon: <Icon library="wp" icon="close-small" iconSize={iconSize} />,
		},
	];
}

export const TextAlign = ({
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
				name: generateExtensionId(block, 'text-align'),
				value,
				attribute: 'blockeraTextAlign',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				columns="1fr 2.5fr"
				label={__('Text Align', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the horizontal alignment of text within the block, offering alignment options like left, right, center, and justify.',
								'blockera'
							)}
						</p>
					</>
				}
				options={getBlockeraTextAlignSelectOptions()}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraTextAlign', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraTextAlignSelectOptions(iconSize),
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
