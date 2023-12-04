// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	ToggleSelectControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import FontStyleNormalIcon from '../icons/font-style-normal';
import FontStyleItalicIcon from '../icons/font-style-italic';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const FontStyle = ({
	block,
	value,
	onChange,
	defaultValue,
}: {
	block: TBlockProps,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'font-style'),
				value,
			}}
		>
			<ToggleSelectControl
				label={__('Italicize', 'publisher-core')}
				columns="columns-1"
				className="control-first label-center small-gap"
				options={[
					{
						label: __('Normal', 'publisher-core'),
						value: 'normal',
						icon: <FontStyleNormalIcon />,
					},
					{
						label: __('Italic', 'publisher-core'),
						value: 'italic',
						icon: <FontStyleItalicIcon />,
					},
				]}
				isDeselectable={true}
				//
				defaultValue={defaultValue || 'normal'}
				onChange={(newValue) =>
					onChange(
						'publisherFontStyle',
						newValue,
						'',
						(
							attributes: Object,
							setAttributes: (attributes: Object) => void
						): void =>
							setAttributes({
								...attributes,
								style: {
									...(attributes?.style ?? {}),
									fontStyle: newValue,
								},
							})
					)
				}
			/>
		</ControlContextProvider>
	);
};
