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

function getBlockeraDirectionSelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Left to Right', 'blockera'),
			value: 'ltr',
			icon: <Icon icon="direction-ltr" iconSize={iconSize} />,
		},
		{
			label: __('Right to Left', 'blockera'),
			value: 'rtl',
			icon: <Icon icon="direction-rtl" iconSize={iconSize} />,
		},
	];
}

export const TextDirection = ({
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
				name: generateExtensionId(block, 'direction'),
				value,
				attribute: 'blockeraDirection',
				blockName: block.blockName,
			}}
		>
			<ToggleSelectControl
				label={__('Direction', 'blockera')}
				labelPopoverTitle={__('Text Direction', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the text direction and layout directionality of block.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="direction-ltr" iconSize="18" />
							{__('Left To Right (LTR)', 'blockera')}
						</h3>
						<p>
							{__(
								'Sets the direction of text from left to right, used for languages written in this manner.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="direction-rtl" iconSize="18" />
							{__('Right To Left (RTL)', 'blockera')}
						</h3>
						<p>
							{__(
								'Sets the direction from right to left, essential for languages such as Arabic, Farsi and Hebrew.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 2.5fr"
				options={getBlockeraDirectionSelectOptions()}
				isDeselectable={true}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraDirection', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								getBlockeraDirectionSelectOptions(iconSize),
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
