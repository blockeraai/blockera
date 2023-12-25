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
import { isEmpty } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import FontStyleNormalIcon from '../icons/font-style-normal';
import FontStyleItalicIcon from '../icons/font-style-italic';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { useBlockContext } from '../../../hooks';

export const FontStyle = ({
	block,
	value,
	onChange,
}: {
	block: TBlockProps,
	value: string | void,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	const { isNormalState, getAttributes } = useBlockContext();

	const toWPCompatible = (newValue: Object): Object => {
		if (!isNormalState() || isEmpty(newValue)) {
			return {};
		}

		const blockAttributes = getAttributes();

		return {
			style: {
				...(blockAttributes.attributes?.style ?? {}),
				fontStyle: newValue,
			},
		};
	};

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'font-style'),
				value,
				attribute: 'publisherFontStyle',
				blockName: block.blockName,
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
				defaultValue=""
				onChange={(newValue, ref) => {
					onChange('publisherFontStyle', newValue, {
						ref,
						addOrModifyRootItems: toWPCompatible(newValue),
						deleteItemsOnResetAction: ['style.fontStyle'],
					});
				}}
			/>
		</ControlContextProvider>
	);
};
