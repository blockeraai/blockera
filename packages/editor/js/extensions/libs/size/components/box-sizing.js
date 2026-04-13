// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, SelectControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

function getBlockeraBoxSizingSelectOptions(): any {
	return [
		{
			label: __('Default', 'blockera'),
			value: '',
		},
		{
			label: __('Border Box', 'blockera'),
			value: 'border-box',
		},
		{
			label: __('Content Box', 'blockera'),
			value: 'content-box',
		},
	];
}

export const BoxSizing = ({
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
				name: generateExtensionId(block, 'box-sizing'),
				value,
				attribute: 'blockeraBoxSizing',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				label={__('Box Sizing', 'blockera')}
				labelDescription={
					<p>
						{__(
							'The box-sizing CSS property sets how the total width and height of an element is calculated.',
							'blockera'
						)}
					</p>
				}
				columns="1fr 2.5fr"
				options={getBlockeraBoxSizingSelectOptions()}
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraBoxSizing', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: () =>
								getBlockeraBoxSizingSelectOptions(),
							showIcon: false,
							showLabel: true,
							iconSize: 16,
							emptyValueMeansNoPreview: false,
							showUnmatchedValue: true,
						}),
				}}
			/>
		</ControlContextProvider>
	);
};
