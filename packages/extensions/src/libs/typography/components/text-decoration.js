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
	BaseControl,
	ControlContextProvider,
	ToggleSelectControl,
} from '@publisher/controls';
import { isEmpty } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import TextDecorationUnderlineIcon from '../icons/text-decoration-underline';
import TextDecorationLineThroughIcon from '../icons/text-dectoration-line-through';
import TextDecorationOverlineIcon from '../icons/text-decoration-overline';
import NoneIcon from '../icons/none';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { useBlockContext } from '../../../hooks';

export const TextDecoration = ({
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

		const _newValue = newValue === 'initial' ? 'none' : newValue;

		if ('overline' === newValue) {
			return {};
		}

		const blockAttributes = getAttributes();

		return {
			style: {
				...(blockAttributes.attributes?.style ?? {}),
				typography: {
					...(blockAttributes.attributes?.style?.typography ?? {}),
					textDecoration: _newValue,
				},
			},
		};
	};

	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'text-decoration'),
				value,
				attribute: 'publisherTextDecoration',
				blockName: block.blockName,
			}}
		>
			<BaseControl
				label={__('Decoration', 'publisher-core')}
				columns="columns-1"
				className="control-first label-center small-gap"
			>
				<ToggleSelectControl
					options={[
						{
							label: __('Underline', 'publisher-core'),
							value: 'underline',
							icon: <TextDecorationUnderlineIcon />,
						},
						{
							label: __('Line Through', 'publisher-core'),
							value: 'line-through',
							icon: <TextDecorationLineThroughIcon />,
						},
						{
							label: __('Overline', 'publisher-core'),
							value: 'overline',
							icon: <TextDecorationOverlineIcon />,
						},
						{
							label: __('None', 'publisher-core'),
							value: 'initial',
							icon: <NoneIcon />,
						},
					]}
					isDeselectable={true}
					//
					defaultValue=""
					onChange={(newValue, ref) => {
						onChange('publisherTextDecoration', newValue, {
							ref,
							addOrModifyRootItems: toWPCompatible(newValue),
							deleteItemsOnResetAction: [
								'style.typography.textDecoration',
							],
						});
					}}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
