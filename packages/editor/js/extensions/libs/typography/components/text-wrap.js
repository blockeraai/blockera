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

function getBlockeraTextWrapSelectOptions(): any {
	return [
		{
			label: __('Default', 'blockera'),
			value: '',
		},
		{
			label: __('Pretty Wrap', 'blockera'),
			value: 'pretty',
		},
		{
			label: __('Balance Wrap', 'blockera'),
			value: 'balance',
		},
		{
			label: __('Wrap', 'blockera'),
			value: 'wrap',
		},
		{
			label: __('No Wrap', 'blockera'),
			value: 'nowrap',
		},
	];
}

export const TextWrap = ({
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
				name: generateExtensionId(block, 'text-wrap'),
				value,
				attribute: 'blockeraTextWrap',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				label={__('Text Wrap', 'blockera')}
				labelPopoverTitle={__('Text Wrap', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It controls how text wraps within its container, enhancing both the layout and readability of your content.',
								'blockera'
							)}
						</p>
						<h3>{__('Pretty Wrap', 'blockera')}</h3>
						<p>
							{__(
								'Optimizes line breaks for a visually pleasing and elegant flow.',
								'blockera'
							)}
						</p>
						<h3>{__('Balance Wrap', 'blockera')}</h3>
						<p>
							{__(
								'Evenly distributes text across lines for a balanced, harmonious layout.',
								'blockera'
							)}
						</p>
						<h3>{__('No Wrap', 'blockera')}</h3>
						<p>
							{__(
								'Keeps text in a single line without any breaks.',
								'blockera'
							)}
						</p>
						<h3>{__('Wrap', 'blockera')}</h3>
						<p>
							{__(
								'Applies standard wrapping rules to break text at natural points.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 2.5fr"
				options={getBlockeraTextWrapSelectOptions()}
				customMenuPosition="top"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraTextWrap', newValue, { ref })
				}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: () =>
								getBlockeraTextWrapSelectOptions(),
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
